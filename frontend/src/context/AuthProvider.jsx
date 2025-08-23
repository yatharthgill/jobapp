// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";

export const AuthProvider = ({ children }) => {


  // Read user from cookie initially
  const [user, setUser] = useState(() => {
    const savedUser = Cookies.get("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(user ? false : true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        Cookies.set("user", JSON.stringify(firebaseUser), { expires: 7 }); // expires in 7 days
      } else {
        Cookies.remove("user");
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);


  // Firebase logout
  const logoutFirebase = async () => {
    try {
      await signOut(auth);
      console.log("Firebase logged out");
    } catch (error) {
      console.error("Firebase logout error:", error);
    }
  };

  // Backend logout (cookie-based)
  const logoutBackend = async () => {
    try {
      await fetch('http://localhost:8000/auth/logout', {
        method: "POST",
        credentials: "include", // include cookies
      });
      console.log("Backend session cleared");
    } catch (error) {
      console.error("Backend logout error:", error);
    }
  };

  // Combined logout function
  const logout = async () => {
    await logoutFirebase();
    await logoutBackend();
    setUser(null);
    Cookies.remove("user");
    window.location.href = "/auth/login";
    };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
