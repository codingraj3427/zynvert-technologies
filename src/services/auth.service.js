import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile // Import this to update Firebase Display Name
} from "firebase/auth";
import { auth } from "../config/firebase"; 
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5172/api';

const googleProvider = new GoogleAuthProvider();

// Helper: Sync user with your Postgres Backend
// Added "additionalData" param to carry first/last name/phone
const syncUserWithBackend = async (user, additionalData = {}) => {
  if (!user) return;
  
  try {
    const token = await user.getIdToken();
    
    // Send token in header, and specific form data in body
    const response = await axios.post(`${API_URL}/auth/sync`, additionalData, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    return response.data;
  } catch (error) {
    console.error("Backend Sync Failed:", error);
    // You might want to throw this error to handle it in the UI
    throw error;
  }
};

export const authService = {
  // 1. Login
  login: async (email, password) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    // Just sync, no extra data needed usually for login
    await syncUserWithBackend(user);
    return user;
  },

  // 2. Register (Updated to accept specific fields)
  register: async (firstName, lastName, phone, email, password) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const { user } = userCredential;
    
    // Optional: Update Firebase "Display Name" for consistency in Firebase Console
    try {
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });
    } catch (e) {
      console.warn("Could not update Firebase Display Name", e);
    }

    // Sync with Postgres, passing the new fields in the body
    await syncUserWithBackend(user, {
      firstName,
      lastName,
      phone
    }); 
    return user;
  },

  // 3. Google Login
  loginWithGoogle: async () => {
    const userCredential = await signInWithPopup(auth, googleProvider);
    const { user } = userCredential;
    // Google provides names/email, so we don't pass manual data here
    await syncUserWithBackend(user);
    return user;
  },

  // 4. Logout
  logout: async () => {
    await signOut(auth);
  },

  // 5. Get Token
  getToken: async () => {
    if (auth.currentUser) {
      return await auth.currentUser.getIdToken();
    }
    return null;
  }
};