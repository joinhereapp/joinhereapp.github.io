import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getFirestore, collection, addDoc, query, where, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// Firebase Configuration from the main app
const firebaseConfig = {
  apiKey: "AIzaSyCYeGsLzyrIRbTY1qSAp6NESEDageXXDhk",
  authDomain: "hereantigravi.firebaseapp.com",
  projectId: "hereantigravi",
  storageBucket: "hereantigravi.firebasestorage.app",
  messagingSenderId: "430636450611",
  appId: "1:430636450611:web:be6496212711fb71fc3446",
  measurementId: "G-CEQ10XF480"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM Elements
const form = document.getElementById('waitlist-form');
const emailInput = document.getElementById('email');
const submitBtn = document.getElementById('submit-btn');
const statusMessage = document.getElementById('status-message');

form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const email = emailInput.value.trim().toLowerCase();
  if (!email) return;

  // UI state to loading
  submitBtn.disabled = true;
  submitBtn.innerHTML = '<span>Gönderiliyor...</span>';
  statusMessage.textContent = '';
  statusMessage.className = '';

  try {
    // Check if email already exists
    const q = query(collection(db, "waitlist_emails"), where("email", "==", email));
    const querySnapshot = await getDocs(q);
    
    if (!querySnapshot.empty) {
      statusMessage.textContent = 'Bu e-posta adresi zaten bekleme listesinde!';
      statusMessage.className = 'error-msg';
    } else {
      // Add new email
      await addDoc(collection(db, "waitlist_emails"), {
        email: email,
        timestamp: serverTimestamp(),
        source: 'landing_page_v1'
      });
      
      statusMessage.textContent = 'Harika! Listeye başarıyla eklendin. Kapılar açıldığında haber vereceğiz.';
      statusMessage.className = 'success-msg';
      emailInput.value = ''; // clear input
    }
  } catch (error) {
    console.error("Error adding to waitlist: ", error);
    statusMessage.textContent = 'Bir hata oluştu. Lütfen daha sonra tekrar dene.';
    statusMessage.className = 'error-msg';
  } finally {
    // Reset button UI
    submitBtn.disabled = false;
    submitBtn.innerHTML = `
      <span>Listeye Katıl</span>
      <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>
    `;
  }
});
