import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider} from "./context/AuthProvider";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import Resume from "./pages/Resume";
import Profile from "./pages/Profile";
import { ThemeProvider } from "./components/theme-provider";
import { Toaster } from "react-hot-toast";
import { useAuth } from "./context/useAuth";
import Jobs from "./pages/Jobs";

// Protected route
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null; // prevent flicker
  return user ? children : <Navigate to="/auth/login" replace />;
};

// Auth-only route (redirect if logged in)
const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return !user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      <Router>
        <AuthProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <Routes>
            {/* Public */}
            <Route path="/" element={<Layout><Home /></Layout>} />

            {/* Auth pages */}
            <Route
              path="/auth/login"
              element={
                <AuthRoute>
                  <Layout><Auth isLogin={true} /></Layout>
                </AuthRoute>
              }
            />
            <Route
              path="/auth/signup"
              element={
                <AuthRoute>
                  <Layout><Auth isLogin={false} /></Layout>
                </AuthRoute>
              }
            />

            {/* Protected */}
            <Route
              path="/resume"
              element={
                <ProtectedRoute>
                  <Layout><Resume /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/jobs"
              element={
                <ProtectedRoute>
                  <Layout><Jobs /></Layout>
                </ProtectedRoute>
              }
            />
            <Route
              path="/profile"
              element={
                <ProtectedRoute>
                  <Layout><Profile /></Layout>
                </ProtectedRoute>
              }
            />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

export default App;
