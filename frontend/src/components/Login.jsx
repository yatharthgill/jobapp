import React, { useState } from "react";
import { auth, googleProvider, githubProvider } from "../firebase";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import axios from "axios";

const API = "http://localhost:8000/auth/login";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

const handleEmailLogin = async () => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const idToken = await userCredential.user.getIdToken();

    await axios.post(API, { token: idToken }, { withCredentials: true });

    alert("Login successful!");
  } catch (error) {
    alert(error.message);
  }
};


  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post(API, { token: idToken }, { withCredentials: true });
      console.log("App JWT:", res.data.data.token);
      alert("Login with Google successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post(API, { token: idToken }, { withCredentials: true });
      console.log("App JWT:", res.data.data.token);
      alert("Login with GitHub successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
        <input
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-blue-500 text-white py-3 rounded mb-4 hover:bg-blue-600 transition"
          onClick={handleEmailLogin}
        >
          Login
        </button>
        <div className="text-center my-4">OR</div>
        <button
          className="w-full bg-red-500 text-white py-3 rounded mb-2 hover:bg-red-600 transition"
          onClick={handleGoogleLogin}
        >
          Login with Google
        </button>
        <button
          className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900 transition"
          onClick={handleGithubLogin}
        >
          Login with GitHub
        </button>
      </div>
    </div>
  );
};

export default Login;
