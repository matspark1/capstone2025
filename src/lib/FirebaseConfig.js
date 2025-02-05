// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { initializeAuth, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: "AIzaSyACJEOlG_FH0nQQZEg2jyyIQxe95aNrCso",
  authDomain: "helios-docs.firebaseapp.com",
  databaseURL: "https://helios-docs-default-rtdb.firebaseio.com",
  projectId: "helios-docs",
  storageBucket: "helios-docs.firebasestorage.app",
  messagingSenderId: "1008423413179",
  appId: "1:1008423413179:web:c2d300bf3cff0ea760509e",
  measurementId: "G-NPY3YXQ366",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
//const analytics = getAnalytics(app);
export const auth = getAuth(app);
