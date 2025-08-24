// src/context/AuthProvider.jsx
import React, { useState, useEffect } from "react";
import AuthContext from "./AuthContext";
import { auth } from "../firebase";
import { signOut } from "firebase/auth";
import Cookies from "js-cookie";
import axiosInstance from "@/axiosInstance";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
  // Read user from cookie initially
  const navigate = useNavigate()
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
    } catch  {
      toast.error("Firebase logout failed");
    }
  };

  // Backend logout (cookie-based)
  const logoutBackend = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      toast.success("Logout Successful");
    } catch  {
      toast.error("Backend logout failed");
    }
  };

  // Combined logout function
  const logout = async () => {
    await logoutFirebase();
    await logoutBackend();
    setUser(null);
    Cookies.remove("user");
    navigate('/auth/login')
  };

  return (
    <AuthContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
