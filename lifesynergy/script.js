import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js/+esm';

// Supabase setup
const supabaseUrl = 'https://clxuhmohunqntgynwmkm.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNseHVobW9odW5xbnRneW53bWttIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxNDg2NDMsImV4cCI6MjA3MjcyNDY0M30.gLPMfIREp-zCS5B3x5bbfAeHEWdjS1pDWA1Wu72LxHA';
const supabase = createClient(supabaseUrl, supabaseKey);

// Firebase setup
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Carousel
const carouselContainer = document.querySelector('.carousel');
const imageUrls = [
  
  'https://images.unsplash.com/photo-1526256262350-7da7584cf5eb?w=300&h=400',
  'https://unsplash.com/photos/men-carrying-bags-walking-near-house-VDKV4Xd0nTc',
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=300&h=400',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=300&h=400',
  'https://images.unsplash.com/photo-1511988617509-a57c8a288659?w=300&h=400',
  'https://images.unsplash.com/photo-1526045612212-70caf35c14df?w=300&h=400'
];

imageUrls.forEach((url,index)=>{
  const img = document.createElement('img');
  img.src = url;
  img.className = index===0?'active':'';
  carouselContainer.appendChild(img);
});

let currentIndex = 0;
setInterval(()=>{
  const images = carouselContainer.querySelectorAll('img');
  images.forEach(img=> img.className='');
  currentIndex = (currentIndex + 1) % images.length;
  images[currentIndex].className = 'active';
}, 3000);

// OTP Handling
const loginForm = document.getElementById('loginForm');
const otpModal = document.getElementById('otpModal');
const otpInput = document.getElementById('otpInput');
const verifyOtpBtn = document.getElementById('verifyOtpBtn');

loginForm.addEventListener('submit', async e=>{
  e.preventDefault();
  const aadhaar = e.target.aadhaar.value;
  const phone = e.target.phone.value;

  // Supabase Aadhaar Check
  const { data, error } = await supabase.rpc('get_user_by_aadhaar', { aadhaar_input: aadhaar }).single();
  if(!data){ alert('Aadhaar not registered!'); return; }

  // Firebase reCAPTCHA
  window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { size: 'invisible' });
  const appVerifier = window.recaptchaVerifier;

  try {
    const confirmationResult = await auth.signInWithPhoneNumber(phone, appVerifier);
    window.confirmationResult = confirmationResult;
    otpModal.style.display = 'flex';
  } catch(err) {
    console.error(err);
    alert('Failed to send OTP: '+err.message);
  }
});

verifyOtpBtn.addEventListener('click', async ()=>{
  const otp = otpInput.value;
  try {
    const result = await window.confirmationResult.confirm(otp);
    const user = result.user;
    alert('OTP verified! User ID: '+user.uid);
    window.location.href = '/dashboard.html';
  } catch(err){
    console.error(err);
    alert('Incorrect OTP!');
  }
});
