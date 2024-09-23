// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDNxd2P6ReWO8kGXCsdM19YeNyFBSr2mBI",
  authDomain: "test-5a545.firebaseapp.com",
  projectId: "test-5a545",
  storageBucket: "test-5a545.appspot.com",
  messagingSenderId: "1080635586860",
  appId: "1:1080635586860:web:b1eb5beded4e150c4dd489",
  measurementId: "G-EMG2ZGKJ0E",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
