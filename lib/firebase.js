// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"
import AsyncStorage from '@react-native-async-storage/async-storage'

const firebaseConfig = {
  apiKey: "AIzaSyD119YMed5b0fhEAW7WHz5l1H66UnByhLY",
  authDomain: "artvista-ac4b0.firebaseapp.com",
  projectId: "artvista-ac4b0",
  storageBucket: "artvista-ac4b0.firebasestorage.app",
  messagingSenderId: "890175720007",
  appId: "1:890175720007:web:280dde2056e9b384433f62",
  measurementId: "G-FNBZHXT571",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});
const db = getFirestore(app);
const storage = getStorage(app);


export const COLLECTIONS = {
  ARTWORKS: "artworks",
  COMMENTS: "comments",
  PROFILES: "profiles",
  LIKES: "likes",
};

export const STORAGE_PATHS = {
  AVATARS: "avatars",
  ARTWORKS: "artworks",
};

export { auth, db, storage}
