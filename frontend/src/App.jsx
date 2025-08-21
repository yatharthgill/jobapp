import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthProvider";
import { useAuth } from "./context/useAuth";

import Layout from "./components/Layout";
import Home from "./pages/Home";
import Auth from "./pages/Auth";
import { ThemeProvider } from "./components/theme-provider";

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return user ? children : <Navigate to="/auth" replace />;
};

const AuthRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div>Loading...</div>;
  return !user ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public pages */}
          <Route
            path="/"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />

          {/* Auth routes */}
          <Route
            path="/auth/login"
            element={
              <AuthRoute>
                <Layout>
                <Auth isLogin={true} />
                </Layout>
              </AuthRoute>
            }
          />
          <Route
            path="/auth/signup"
            element={
              <AuthRoute>
                <Layout>
                <Auth isLogin={false} />
                </Layout>
              </AuthRoute>
            }
          />

          {/* Protected route example */}
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <h1>Dashboard - Only for logged-in users</h1>
                </Layout>
              </ProtectedRoute>
            }
          />

          {/* Catch-all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
