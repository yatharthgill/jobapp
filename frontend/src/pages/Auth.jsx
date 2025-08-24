import React, { useState } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signInWithPopup,
  sendEmailVerification,
  sendPasswordResetEmail,
} from "firebase/auth";

import { auth, googleProvider, githubProvider } from "../firebase";
import { EyeIcon, EyeClosedIcon, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/useAuth";
import toast from "react-hot-toast";
import axiosInstance from "@/axiosInstance";
// --- Helper Components ---

// Icon for Google
const GoogleIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    x="0px"
    y="0px"
    width="24"
    height="24"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
    <path
      fill="#FF3D00"
      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
    ></path>
    <path
      fill="#4CAF50"
      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
    ></path>
    <path
      fill="#1976D2"
      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
    ></path>
  </svg>
);

// Icon for GitHub
const GithubIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="currentColor"
  >
    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
  </svg>
);

// --- Main App Component ---
export default function Auth({ isLogin: initialIsLogin = true }) {
  const { logout } = useAuth();
  const [isLogin, setIsLogin] = useState(initialIsLogin);
  const navigate = useNavigate();
  // State for form inputs
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_BACKEND_URL;
  // --- Error Mapper ---
  const getAuthErrorMessage = (error) => {
    const errorCode = error.code;

    switch (errorCode) {
      case "auth/invalid-credential":
      case "auth/user-not-found":
        return "Invalid Credentials.";
      case "auth/wrong-password. Please try again.":
        return "Invalid Credentials. Please try again.";
      case "auth/email-already-in-use":
        return "This email is already registered. Please login instead.";
      case "auth/weak-password":
        return "Password is too weak. Please use a stronger one.";
      case "auth/too-many-requests":
        return "Too many failed attempts. Try again later.";
      case "auth/network-request-failed":
        return "Network error. Please check your internet connection.";
      case "auth/popup-closed-by-user":
        return "The login popup was closed before completing sign in.";
      default:
        return "Something went wrong. Please try again.";
    }
  };

  // --- Success Mapper ---
  const getAuthSuccessMessage = (action, provider) => {
    if (provider) {
      return `${
        action === "login" ? "Login" : "Signup"
      } with ${provider} successful!`;
    }
    return action === "login"
      ? "Login successful"
      : "Signup successful! Please verify your email before logging in.";
  };

  // --- Authentication Handlers ---
  const handleEmailAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (isLogin) {
        // --- Login Logic ---
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        if (!user.emailVerified) {
          await sendEmailVerification(user);
          await logout();
          toast.error(
            "Email not verified. A verification link has been sent to your email."
          );
          return;
        }

        const idToken = await user.getIdToken();
        const loginRes = await axiosInstance.post("/auth/login", {
          token: idToken,
        });

        if (!loginRes.data.success) {
          toast.error(loginRes.data.message || "Login failed");
          await logout();
          return;
        }

        toast.success(getAuthSuccessMessage("login"));
        navigate("/");
      } else {
        // --- Signup Logic ---
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;

        await sendEmailVerification(user);
        const idToken = await user.getIdToken();

        await axiosInstance.post("/auth/signup", { token: idToken });

        toast.success(getAuthSuccessMessage("signup"));
        setIsLogin(true);
        await logout(); // Ensure user logs out after signup
      }
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handleSocialAuth = async (provider) => {
    setLoading(true);
    const providerName = provider === googleProvider ? "Google" : "GitHub";
    const authAction = isLogin ? "login" : "signup";

    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();

      await axiosInstance.post(
        `/auth/${authAction}`,
        { token: idToken },
        { withCredentials: true }
      );

      toast.success(getAuthSuccessMessage(authAction, providerName));
      navigate("/");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      toast.error("Please enter your email to reset password.");
      return;
    }

    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Password reset link sent! Please check your inbox.");
    } catch (error) {
      toast.error(getAuthErrorMessage(error));
    }
  };

  // --- Render ---
  return (
    <div className="font-sans text-gray-900 bg-gray-50 flex justify-center p-4 min-h-screen relative">
      <div className="w-full max-w-md" style={{ perspective: "1000px" }}>
        <div
          className={`relative w-full h-full transition-transform duration-700 ease-in-out`}
          style={{
            transformStyle: "preserve-3d",
            transform: isLogin ? "rotateY(0deg)" : "rotateY(180deg)",
          }}
        >
          {/* Login Form */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-xl p-8 backface-hidden flex flex-col justify-center pb-20">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Welcome Back!
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Sign in to continue
            </p>

            <form onSubmit={handleEmailAuth}>
              <div className="mb-4">
                <label
                  htmlFor="login-email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email Address
                </label>
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="login-password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="login-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    required
                  />
                  <span
                    className="absolute top-3 right-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                  </span>
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className={`w-full flex items-center justify-center bg-blue-600 hover:bg-blue-700 
    text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out 
    transform hover:scale-105 ${
      loading ? "opacity-70 cursor-not-allowed" : ""
    }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Log In"
                )}
              </button>
            </form>

            <div className="flex justify-end mt-2">
              <button
                disabled={loading}
                type="button"
                className="text-sm text-blue-700 hover:underline focus:outline-none"
                onClick={handlePasswordReset}
                aria-label="Forgot Password"
              >
                Forgot Password?
              </button>
            </div>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                disabled={loading}
                onClick={() => handleSocialAuth(googleProvider)}
                className="flex items-center justify-center w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                <GoogleIcon />{" "}
                <span className="ml-3">Continue with Google</span>
              </button>
              <button
                disabled={loading}
                onClick={() => handleSocialAuth(githubProvider)}
                className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                <GithubIcon />{" "}
                <span className="ml-3">Continue with GitHub</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              Don't have an account?{" "}
              <button
                disabled={loading}
                onClick={() => {
                  setIsLogin(false); // flip the card
                  navigate("/auth/signup"); // change the URL
                }}
                className="font-semibold text-blue-600 hover:underline focus:outline-none"
              >
                Sign Up
              </button>
            </p>
          </div>

          {/* Signup Form */}
          <div className="absolute w-full h-full bg-white rounded-xl shadow-xl p-8 backface-hidden transform rotate-y-180 flex flex-col justify-center">
            <h2 className="text-3xl font-bold text-center text-gray-800 mb-2">
              Create Account
            </h2>
            <p className="text-center text-gray-500 mb-8">
              Get started with a new account
            </p>

            <form onSubmit={handleEmailAuth}>
              <div className="mb-4">
                <label
                  htmlFor="signup-email"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Email Address
                </label>
                <input
                  id="signup-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                  required
                />
              </div>
              <div className="mb-6">
                <label
                  htmlFor="signup-password"
                  className="block text-gray-700 text-sm font-bold mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                    required
                  />
                  <span
                    className="absolute top-3 right-3 cursor-pointer"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeIcon /> : <EyeClosedIcon />}
                  </span>
                </div>
              </div>
              <button
                disabled={loading}
                type="submit"
                className={`w-full flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 
    text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out 
    transform hover:scale-105 ${
      loading ? "opacity-70 cursor-not-allowed" : ""
    }`}
              >
                {loading ? (
                  <Loader2 className="animate-spin w-5 h-5" />
                ) : (
                  "Sign Up"
                )}
              </button>
            </form>

            <div className="my-6 flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-400">or</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="flex flex-col space-y-3">
              <button
                disabled={loading}
                onClick={() => handleSocialAuth(googleProvider)}
                className="flex items-center justify-center w-full bg-white border border-gray-300 hover:bg-gray-100 text-gray-700 font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                <GoogleIcon /> <span className="ml-3">Sign up with Google</span>
              </button>
              <button
                disabled={loading}
                onClick={() => handleSocialAuth(githubProvider)}
                className="flex items-center justify-center w-full bg-gray-800 hover:bg-gray-900 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
              >
                <GithubIcon /> <span className="ml-3">Sign up with GitHub</span>
              </button>
            </div>

            <p className="text-center text-sm text-gray-500 mt-8">
              Already have an account?{" "}
              <button
                disabled={loading}
                onClick={() => {
                  setIsLogin(true);
                  navigate("/auth/login");
                }}
                className="font-semibold text-indigo-600 hover:underline focus:outline-none"
              >
                Log In
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Helper CSS */}
      <style>{`
    .rotate-y-180 { transform: rotateY(180deg); }
    .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
  `}</style>
    </div>
  );
}
