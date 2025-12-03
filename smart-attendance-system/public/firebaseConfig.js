const firebaseConfig = {
    apiKey: "AIzaSyCQgLM_dI2qG0WNs4Ss6nSy2X5H_AQVY",
    authDomain: "smart-attendance-system-ce608.firebaseapp.com",
    projectId: "smart-attendance-system-ce608",
    storageBucket: "smart-attendance-system-ce608.appspot.com",
    messagingSenderId: "847178446938",
    appId: "1:847178446938:web:767f7501bea525760b0063",
    measurementId: "G-XCZN7GWJVY"
};

// Initialize Firebase (Compat SDK)
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();

