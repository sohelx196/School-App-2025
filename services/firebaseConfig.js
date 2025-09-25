// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAji6ysdyRsbkFISAfXRQl55VxRPQLfkUU",
  authDomain: "school-app-ef4e2.firebaseapp.com",
  projectId: "school-app-ef4e2",
  storageBucket: "school-app-ef4e2.firebasestorage.app",
  messagingSenderId: "435695507127",
  appId: "1:435695507127:web:6071d4c91ac7116e525f32",
  measurementId: "G-TLBBZTS9K5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const analytics = getAnalytics(app);

// Initialize Firestore
const db = getFirestore(app);

export {db};