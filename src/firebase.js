// firebase.js

// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getMessaging } from "firebase/messaging";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration 
const firebaseConfig = {
  apiKey: "AIzaSyBEt1x4HJKJXLuoRj0SGDVfj6evFeWiV3M",
  authDomain: "maid-match-7e3c8.firebaseapp.com",
  projectId: "maid-match-7e3c8",
  storageBucket: "maid-match-7e3c8.appspot.com",
  messagingSenderId: "381944105516",
  appId: "1:381944105516:web:08b345c0b5237502709f89",
  measurementId: "G-33NWYCQ614"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const messaging = getMessaging(app); //  FCM
export const analytics = getAnalytics(app); 
export { app }; //added this to import the chatpage: del later
