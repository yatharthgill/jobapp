// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Track Firebase auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
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
    window.location.href = "/auth/login";
    };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
