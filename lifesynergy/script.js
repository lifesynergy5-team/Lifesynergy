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
const carouselContainer = document.querySelector('.carousel');

// State variables
let currentUsername = '';
let currentAadhaar = ''; // store Aadhaar entered by user

// ----------------------
// Helpers
// ----------------------
function maskMobile(mobile) {
  if (!mobile) return '';
  const s = mobile.replace(/\D/g, '');
  return s.length > 4 ? '******' + s.slice(-4) : s;
}

function maskAadhaar(aadhaar) {
  if (!aadhaar) return '';
  const s = aadhaar.replace(/\D/g, '');
  return s.length === 12 ? s.slice(0, 4) + ' **** **** ' + s.slice(-4) : s;
}

// ----------------------
// Login form submit
// ----------------------
loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const aadhaar = (e.target.aadhaar.value || '').trim();

  if (!/^\d{12}$/.test(aadhaar)) {
    alert('Enter a valid 12-digit Aadhaar number.');
    return;
  }

  try {
    // Save Aadhaar for later use
    currentAadhaar = aadhaar;

    // Get user by Aadhaar
    const { data, error } = await supabase
      .rpc('get_user_by_aadhaar', { aadhaar_input: aadhaar })
      .single();

    if (error || !data) {
      alert('Aadhaar not registered or Supabase error.');
      return;
    }

    const username = data.username ?? data.user_name ?? null;
    const mobile = data.mobile ?? data.decrypted_mobile ?? null;

    if (!mobile) {
      alert('No mobile found in DB for this Aadhaar.');
      return;
    }

    currentUsername = username;

    // Show masked details in OTP modal
    const maskedMobile = maskMobile(mobile);
    const maskedAadhaar = maskAadhaar(aadhaar);
    otpUser.textContent =
      (username ? `Hi ${username}, ` : '') +
      `OTP will be sent to ${maskedMobile} (Aadhaar: ${maskedAadhaar})`;

    // show human verification message
    verificationStatus.style.display = 'block';
    verificationStatus.textContent = 'Human Verification...';

    // Setup invisible reCAPTCHA
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
      } catch {}
    }

    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier(
      'recaptcha-container',
      { size: 'invisible' }
    );

    const phoneE164 = mobile.startsWith('+')
      ? mobile
      : '+91' + mobile.replace(/\D/g, '');
    window.confirmationResult = await auth.signInWithPhoneNumber(
      phoneE164,
      window.recaptchaVerifier
    );

    // Show OTP modal
    otpModal.style.display = 'flex';
    otpInput.value = '';
    verificationStatus.style.display = 'none'; // hide after OTP sent
  } catch (err) {
    console.error(err);
    alert('Unexpected error: ' + (err.message || JSON.stringify(err)));
  }
});

// ----------------------
// OTP verification
// ----------------------
verifyOtpBtn.addEventListener('click', async () => {
  const otp = (otpInput.value || '').trim();
  if (!/^\d{6}$/.test(otp)) {
    alert('Enter a valid 6-digit OTP.');
    return;
  }
  if (!window.confirmationResult) {
    alert('No OTP transaction found.');
    return;
  }

  try {
    const result = await window.confirmationResult.confirm(otp);
    alert(
      '✅ OTP verified! Phone: ' +
        (result.user ? result.user.phoneNumber : 'unknown')
    );

    // Save Aadhaar + Username to localStorage
    if (currentUsername) {
      localStorage.setItem('loggedInUser', currentUsername);
    }
    if (currentAadhaar) {
      localStorage.setItem('loggedInAadhaar', currentAadhaar);
    }

    // Redirect after login
    window.location.href = '/home/index.html';
  } catch (verifyErr) {
    alert('OTP verification failed: ' + (verifyErr.message || verifyErr));
  }
});

// ----------------------
// Carousel animation
// ----------------------
let currentIndex = 0;
setInterval(() => {
  const images = carouselContainer.querySelectorAll('img');
  if (!images.length) return;
  images.forEach((img) => (img.className = ''));
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].className = 'active';
}, 2000);
