import React from "react";
import Navbar from "../components/Navbar";
import Hero from "../components/Main";
import Footer from "../components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950">
      <Navbar />
      <Hero />
      <Footer />
    </div>
  );
}
