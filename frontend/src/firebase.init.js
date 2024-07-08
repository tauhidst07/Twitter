// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; 
import {getAuth} from "firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyC3ByxMgvNFp1nJtGReVLg632sM5ouRa2c",
  authDomain: "twitter-clone-791d4.firebaseapp.com",
  projectId: "twitter-clone-791d4",
  storageBucket: "twitter-clone-791d4.appspot.com",
  messagingSenderId: "905453878432",
  appId: "1:905453878432:web:ba8d1d2bf19fa7a11e9dc5",
  measurementId: "G-ERWFKP7YH9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig); 
const auth = getAuth(app);
const analytics = getAnalytics(app); 

export default auth;