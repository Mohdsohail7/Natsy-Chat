import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Top Navbar */}
      <nav className="flex justify-between items-center px-6 py-4 bg-transparent text-white">
        {/* Left - Logo */}
        <h1 className="text-2xl font-bold">Natsy Chat</h1>

        {/* Center - Links */}
        <div className="hidden md:flex space-x-6 flex-1 justify-center">
          <Link to="/" className="hover:text-indigo-300 transition">
            Home
          </Link>
          <Link to="/about" className="hover:text-indigo-300 transition">
            About
          </Link>
          <Link to="/support" className="hover:text-indigo-300 transition">
            Support
          </Link>
        </div>

        {/* Right - Login button */}
        <div className="hidden md:flex">
          <Link
            to="/login"
            className="px-4 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-400 transition"
          >
            Login
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white" onClick={toggleSidebar}>
          {isOpen ? <FiX size={24} /> : <FiMenu size={24} />}
        </button>
      </nav>

      {/* Mobile Sidebar */}
      <div
        className={`fixed top-0 right-0 h-full w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out z-50 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Close button only */}
        <div className="flex justify-end px-6 py-4 border-b border-gray-700">
          <button onClick={toggleSidebar}>
            <FiX size={24} />
          </button>
        </div>

        {/* Centered Links */}
        <div className="flex flex-col p-6 space-y-6 items-center text-center">
          <Link to="/" className="hover:text-indigo-300" onClick={toggleSidebar}>
            Home
          </Link>
          <Link to="/about" className="hover:text-indigo-300" onClick={toggleSidebar}>
            About
          </Link>
          <Link to="/support" className="hover:text-indigo-300" onClick={toggleSidebar}>
            Support
          </Link>
          <Link
            to="/login"
            className="mt-6 px-6 py-2 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-400 transition"
            onClick={toggleSidebar}
          >
            Login
          </Link>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={toggleSidebar}
        />
      )}
    </>
  );
}
