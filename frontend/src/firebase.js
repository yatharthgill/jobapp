// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getAuth,GoogleAuthProvider,GithubAuthProvider} from"firebase/auth"

const firebaseConfig = {
  apiKey: "AIzaSyB5tf_ep9CRkUwQd4pHj2ZFAedtKjqooAg",
  authDomain: "jobapp-05.firebaseapp.com",
  projectId: "jobapp-05",
  storageBucket: "jobapp-05.firebasestorage.app",
  messagingSenderId: "918302528614",
  appId: "1:918302528614:web:2d2e0608bcebf176b189a7",
  measurementId: "G-QT3KGSYP68"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
export const githubProvider = new GithubAuthProvider();