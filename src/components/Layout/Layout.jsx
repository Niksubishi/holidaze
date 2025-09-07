import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { SkipNavigation } from "../UI/AccessibleComponents";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen flex flex-col bg-dark">
      <SkipNavigation />
      <Navbar />
      <main id="main-content" className="flex-1" tabIndex={-1}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default Layout;
