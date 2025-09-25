import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

export default function Main() {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);

  const { loginAsGuest } = useAuth();
  const navigate = useNavigate();

  const handleStartChat = async (e) => {
    e.preventDefault();
    if (username.trim() === "") {
      toast.error("Please enter a username before starting random chat.");
      return;
    }

    try {
      setLoading(true);
      await loginAsGuest(username);
      toast.success("guest login...");
      navigate("/chat");
    } catch (err) {
      toast.error(err.response?.data?.message || "Guest login failed. Try again.");

    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-center items-center text-center px-6">
      {/* Title */}
      <motion.h2
        className="text-4xl md:text-6xl font-extrabold leading-tight mb-4 text-white"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        Connect with{" "}
        <span className="text-indigo-400">Random People</span> Instantly
      </motion.h2>

      {/* Subtitle */}
      <p className="text-lg md:text-xl max-w-2xl mb-6 text-white">
        Enter your username and start chatting with strangers worldwide.  
        Simple, fast, and anonymous.
      </p>

      {/* Username Input & Start Chat */}
      <div className="flex flex-col md:flex-row items-center gap-4 w-full max-w-md">
        <input
          type="text"
          placeholder="Enter username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="flex-1 px-4 py-3 rounded-xl bg-gray-800 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          disabled={loading}
        />
        <button
          onClick={handleStartChat}
          disabled={loading}
          className="px-6 py-3 bg-indigo-500 text-white rounded-xl font-semibold hover:bg-indigo-400 transition"
        >
          {loading ? "Starting..." : "Start Chat"}
        </button>
      </div>
      {/* Auth Links */}
      <div className="mt-4 mb-16 text-gray-300 text-sm">
        <p>
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-indigo-400 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>

      {/* Dummy Section */}
      <section className="w-full max-w-5xl bg-gray-900 rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-8">
        {/* Dummy Image */}
        {/* <img
        src="https://source.unsplash.com/400x250/?chat,people"
        alt="Random Chat"
        className="rounded-xl shadow-md"
        /> */}

        {/* Dummy Text */}
        <div className="text-left text-white">
          <h3 className="text-2xl font-bold mb-4 text-indigo-400">
            What is Random Chat?
          </h3>
          <p className="mb-6 text-gray-300">
            Random Chat lets you instantly connect with new people across the
            world. Whether you want to have fun, make friends, or just kill
            time, start chatting with strangers today.
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-400">
            <li>⚡ Fast & easy to use</li>
            <li>🔒 Chat anonymously or with a username</li>
            <li>🌍 Meet new people every time</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
