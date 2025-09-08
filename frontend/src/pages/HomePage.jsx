import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Main from "../components/Main";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950">
      <Navbar />
      <div className="pt-24"> 
        <Main />
      </div>
      <div className="pt-10">
        <Footer />
      </div>
    </div>
  );
}
