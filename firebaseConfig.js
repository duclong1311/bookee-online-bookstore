// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCbd_FlpJLnIVT5OxchEMnKTNrNSNI9WSE",
    authDomain: "bookee-a2ea8.firebaseapp.com",
    projectId: "bookee-a2ea8",
    storageBucket: "bookee-a2ea8.firebasestorage.app",
    messagingSenderId: "620119890515",
    appId: "1:620119890515:web:dff6e02104255e7ad5c4a6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);