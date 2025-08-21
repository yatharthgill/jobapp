// src/components/Layout.jsx
import React from "react";
import NavbarDemo from "./Navbar";
import { ThemeProvider } from "./theme-provider";
// import Footer from "./Footer";

const Layout = ({ children }) => {
  return (
    
    <div className="flex flex-col min-h-screen">
      <NavbarDemo >
      {children}
      </NavbarDemo>
      {/* <Footer /> */}
    </div>
  );
};

export default Layout;
