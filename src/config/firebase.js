import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// ⚠️ REPLACE WITH YOUR ACTUAL FIREBASE KEYS
const firebaseConfig = {
  apiKey: "AIzaSyDS4GE8bXMHt_z7daesxQJi0hBG0WH0ni8",
  authDomain: "zynvert.firebaseapp.com",
  projectId: "zynvert",
  storageBucket: "zynvert.firebasestorage.app",
  messagingSenderId: "571753588518",
  appId: "1:571753588518:web:1d7a7e624bf0b3e12903e7",
  measurementId: "G-PKHYFLTW3R"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();