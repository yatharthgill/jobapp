import React, { useState } from "react";
import { auth, googleProvider, githubProvider } from "../firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import axios from "axios";

const backendUrl = "http://localhost:8000/auth/signup";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailSignup = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      console.log(userCredential.user)
      const idToken = await userCredential.user.getIdToken();
      const res = await axios.post(backendUrl, { token: idToken });
      console.log("App JWT:", res.data.app_token);
      alert("Signup successful!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post(backendUrl, { token: idToken });
      console.log("App JWT:", res.data.app_token);
      alert("Signed up with Google!");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGithubSignup = async () => {
    try {
      const result = await signInWithPopup(auth, githubProvider);
      const idToken = await result.user.getIdToken();
      const res = await axios.post(backendUrl, { token: idToken });
      console.log("App JWT:", res.data.app_token);
      alert("Signed up with GitHub!");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <h2 className="text-2xl font-bold mb-6 text-center">Signup</h2>
        <input
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          className="w-full p-3 mb-4 border rounded focus:outline-none focus:ring-2 focus:ring-green-400"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          className="w-full bg-green-500 text-white py-3 rounded mb-4 hover:bg-green-600 transition"
          onClick={handleEmailSignup}
        >
          Signup
        </button>
        <div className="text-center my-4">OR</div>
        <button
          className="w-full bg-red-500 text-white py-3 rounded mb-2 hover:bg-red-600 transition"
          onClick={handleGoogleSignup}
        >
          Signup with Google
        </button>
        <button
          className="w-full bg-gray-800 text-white py-3 rounded hover:bg-gray-900 transition"
          onClick={handleGithubSignup}
        >
          Signup with GitHub
        </button>
      </div>
    </div>
  );
};

export default Signup;
