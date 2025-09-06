// // Import Supabase
// import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// // ----------------------
// // Config - REPLACE THESE
// // ----------------------
// const supabaseUrl = 'https://clxuhmohunqntgynwmkm.supabase.co';
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseHVobW9odW5xbnRneW53bWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDg2NDMsImV4cCI6MjA3MjcyNDY0M30.gLPMfIREp-zCS5B3x5bbfAeHEWdjS1pDWA1Wu72LxHA'; // <- replace
// const firebaseConfig = {
//     apiKey: "AIzaSyDlFyte7QWQ4UwKLmohQOllYSnlNlCiipM",
//     authDomain: "lifesynergy-23d8c.firebaseapp.com",
//     projectId: "lifesynergy-23d8c",
//     storageBucket: "lifesynergy-23d8c.firebasestorage.app",
//     messagingSenderId: "684928969615",
//     appId: "1:684928969615:web:45c6bf0ea565064109b9fa",
//     measurementId: "G-XLEN0PLNBD"
//   };

// // ----------------------

// // init clients
// const supabase = createClient(supabaseUrl, supabaseKey);
// firebase.initializeApp(firebaseConfig);
// const auth = firebase.auth();

// // DOM elements
// const loginForm = document.getElementById('loginForm');
// const otpModal = document.getElementById('otpModal');
// const otpInput = document.getElementById('otpInput');
// const verifyOtpBtn = document.getElementById('verifyOtpBtn');
// const otpUser = document.getElementById('otpUser');

// // simple helper to mask phone
// function maskMobile(mobile) {
//   if (!mobile) return '';
//   const s = mobile.replace(/\D/g, '');
//   return s.length > 4 ? '******' + s.slice(-4) : s;
// }

// // debug helper
// function showConsoleHelp() {
//   console.info('If something fails:');
//   console.info('- Check Supabase SQL editor: run "select * from get_user_by_aadhaar(\'777888999222\');"');
//   console.info('- Ensure YOUR_SECRET_KEY used in pgp_sym_encrypt is the same used by function');
//   console.info('- Open Network/Console tabs to see Supabase/Firebase errors');
// }

// // ---------- form submit ----------
// loginForm.addEventListener('submit', async (e) => {
//   e.preventDefault();
//   const aadhaar = (e.target.aadhaar.value || '').trim();
//   if (!/^\d{12}$/.test(aadhaar)) {
//     alert('Enter a valid 12-digit Aadhaar number (digits only).');
//     return;
//   }

//   try {
//     console.log('Calling RPC get_user_by_aadhaar with:', aadhaar);
//     const { data, error } = await supabase
//       .rpc('get_user_by_aadhaar', { aadhaar_input: aadhaar })
//       .single();

//     console.log('Supabase RPC response:', { data, error });

//     if (error) {
//       // more explicit error message from Supabase
//       console.error('Supabase error object:', error);
//       alert('Supabase error: ' + (error.message || JSON.stringify(error)));
//       showConsoleHelp();
//       return;
//     }

//     if (!data) {
//       // no row returned
//       alert('Aadhaar not registered! (no row returned for that Aadhaar).');
//       showConsoleHelp();
//       return;
//     }

//     // Expecting returned fields: id, username, aadhaar, mobile
//     const username = data.username ?? data.user_name ?? null;
//     const returnedAadhaar = data.aadhaar ?? data.decrypted_aadhaar ?? null;
//     const mobile = data.mobile ?? data.decrypted_mobile ?? null;

//     console.log('Decoded values from RPC:', { username, returnedAadhaar, mobile });

//     if (!mobile) {
//       alert('No mobile found in DB for this Aadhaar. Check function return columns.');
//       return;
//     }

//     // Optionally verify the decrypted Aadhaar equals user input (debug)
//     if (returnedAadhaar && returnedAadhaar.toString().trim() !== aadhaar) {
//       console.warn('Returned decrypted Aadhaar does not match input Aadhaar.', { returnedAadhaar, aadhaar });
//       // still proceed if you want, or block:
//       // alert('Aadhaar mismatch: database returned a different Aadhaar.');
//       // return;
//     }

//     // show masked mobile + username in modal
//     const masked = maskMobile(mobile);
//     otpUser.textContent = (username ? `Hi ${username}, ` : '') + `OTP will be sent to ${masked}`;

//     // Setup invisible reCAPTCHA (create new one each time to avoid stale widget)
//     if (window.recaptchaVerifier) {
//       try { window.recaptchaVerifier.clear(); } catch (_) { /* ignore if not supported */ }
//     }
//     window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
//       size: 'invisible'
//     });

//     // Send OTP using Firebase to the decrypted mobile
//     const phoneE164 = mobile.startsWith('+') ? mobile : ('+91' + mobile.replace(/\D/g, ''));
//     console.log('Sending OTP to:', phoneE164);

//     let confirmationResult;
//     try {
//       confirmationResult = await auth.signInWithPhoneNumber(phoneE164, window.recaptchaVerifier);
//     } catch (firebaseSendErr) {
//       console.error('Firebase signInWithPhoneNumber error:', firebaseSendErr);
//       // Provide helpful messages for common Firebase errors:
//       if (firebaseSendErr.code === 'auth/invalid-phone-number') {
//         alert('Firebase error: invalid phone number format: ' + phoneE164);
//       } else if (firebaseSendErr.code === 'auth/too-many-requests') {
//         alert('Firebase error: too many requests — try again later.');
//       } else if (firebaseSendErr.code === 'auth/quota-exceeded') {
//         alert('Firebase error: quota exceeded for SMS.');
//       } else {
//         alert('Firebase error sending OTP: ' + (firebaseSendErr.message || firebaseSendErr));
//       }
//       return;
//     }

//     // Save for OTP verification
//     window.confirmationResult = confirmationResult;

//     // Show OTP modal
//     otpModal.style.display = 'flex';
//     otpInput.value = '';
//     console.log('OTP sent; waiting for user verification.');
//   } catch (err) {
//     // More descriptive fallback than the original generic message
//     console.error('Unexpected error during login flow:', err);
//     alert('Unexpected error: ' + (err.message || JSON.stringify(err)));
//     showConsoleHelp();
//   }
// });

// // ---------- verify OTP ----------
// verifyOtpBtn.addEventListener('click', async () => {
//   const otp = (otpInput.value || '').trim();
//   if (!/^\d{6}$/.test(otp)) {
//     alert('Please enter a valid 6-digit OTP.');
//     return;
//   }

//   if (!window.confirmationResult) {
//     alert('No OTP transaction found. Please request OTP again.');
//     return;
//   }

//   try {
//     const result = await window.confirmationResult.confirm(otp);
//     console.log('Firebase verification result:', result);
//     alert('✅ OTP verified! Phone: ' + (result.user ? result.user.phoneNumber : 'unknown'));
//     // redirect to dashboard
//     window.location.href = '/home/index.html';
//   } catch (verifyErr) {
//     console.error('OTP verification error:', verifyErr);
//     if (verifyErr.code === 'auth/invalid-verification-code') {
//       alert('Invalid OTP. Please try again.');
//     } else if (verifyErr.code === 'auth/code-expired') {
//       alert('OTP expired. Request a new one.');
//     } else {
//       alert('OTP verification failed: ' + (verifyErr.message || verifyErr));
//     }
//   }
// });



// const carouselContainer = document.querySelector('.carousel');
// const imageUrls = [
  
// ];

// imageUrls.forEach((url,index)=>{
//   const img = document.createElement('img');
//   img.src = url;
//   img.className = index===0?'active':'';
//   carouselContainer.appendChild(img);
// });

// let currentIndex = 0;
// setInterval(()=>{
//   const images = carouselContainer.querySelectorAll('img');
//   images.forEach(img=> img.className='');
//   currentIndex = (currentIndex + 1) % images.length;
//   images[currentIndex].className = 'active';
// }, 2000);







// Import Supabase
import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// ----------------------
// Config
// ----------------------
const supabaseUrl = 'https://clxuhmohunqntgynwmkm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseHVobW9odW5xbnRneW53bWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDg2NDMsImV4cCI6MjA3MjcyNDY0M30.gLPMfIREp-zCS5B3x5bbfAeHEWdjS1pDWA1Wu72LxHA';
const firebaseConfig = {
    apiKey: "AIzaSyDlFyte7QWQ4UwKLmohQOllYSnlNlCiipM",
    authDomain: "lifesynergy-23d8c.firebaseapp.com",
    projectId: "lifesynergy-23d8c",
    storageBucket: "lifesynergy-23d8c.firebasestorage.app",
    messagingSenderId: "684928969615",
    appId: "1:684928969615:web:45c6bf0ea565064109b9fa",
    measurementId: "G-XLEN0PLNBD"
};

// init clients
const supabase = createClient(supabaseUrl, supabaseKey);
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// DOM elements
const loginForm = document.getElementById('loginForm');
const otpModal = document.getElementById('otpModal');
const otpInput = document.getElementById('otpInput');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');
const otpUser = document.getElementById('otpUser');
const verificationStatus = document.getElementById('verification-status');

function maskMobile(mobile) {
  if (!mobile) return '';
  const s = mobile.replace(/\D/g, '');
  return s.length > 4 ? '******' + s.slice(-4) : s;
}

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const aadhaar = (e.target.aadhaar.value || '').trim();
  if (!/^\d{12}$/.test(aadhaar)) { alert('Enter a valid 12-digit Aadhaar number.'); return; }

  try {
    const { data, error } = await supabase
      .rpc('get_user_by_aadhaar', { aadhaar_input: aadhaar })
      .single();

    if (error || !data) { alert('Aadhaar not registered or Supabase error.'); return; }

    const username = data.username ?? data.user_name ?? null;
    const mobile = data.mobile ?? data.decrypted_mobile ?? null;
    if (!mobile) { alert('No mobile found in DB for this Aadhaar.'); return; }

    const masked = maskMobile(mobile);
    otpUser.textContent = (username ? `Hi ${username}, ` : '') + `OTP will be sent to ${masked}`;

    // show human verification message
    verificationStatus.style.display = 'block';
    verificationStatus.textContent = 'Human Verification...';

    // Setup invisible reCAPTCHA
    if (window.recaptchaVerifier) try{ window.recaptchaVerifier.clear(); }catch{}
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });

    const phoneE164 = mobile.startsWith('+') ? mobile : ('+91' + mobile.replace(/\D/g, ''));
    window.confirmationResult = await auth.signInWithPhoneNumber(phoneE164, window.recaptchaVerifier);

    otpModal.style.display = 'flex';
    otpInput.value = '';
    verificationStatus.style.display = 'none'; // hide after OTP sent
  } catch (err) {
    console.error(err);
    alert('Unexpected error: ' + (err.message || JSON.stringify(err)));
  }
});

// OTP verification
verifyOtpBtn.addEventListener('click', async () => {
  const otp = (otpInput.value || '').trim();
  if (!/^\d{6}$/.test(otp)) { alert('Enter a valid 6-digit OTP.'); return; }
  if (!window.confirmationResult) { alert('No OTP transaction found.'); return; }
  try {
    const result = await window.confirmationResult.confirm(otp);
    alert('✅ OTP verified! Phone: ' + (result.user ? result.user.phoneNumber : 'unknown'));
    window.location.href = '/home/index.html';
  } catch (verifyErr) {
    alert('OTP verification failed: ' + (verifyErr.message || verifyErr));
  }
});

// Carousel
const carouselContainer = document.querySelector('.carousel');
let currentIndex = 0;
setInterval(()=>{
  const images = carouselContainer.querySelectorAll('img');
  if(!images.length) return;
  images.forEach(img=> img.className='');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].className = 'active';
}, 2000);
