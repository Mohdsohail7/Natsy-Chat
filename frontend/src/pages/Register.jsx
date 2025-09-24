import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Spinner from "../components/Spinner";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      return toast.error("Email and password are required.");
    }

    setLoading(true);

    try {
      await register({ email, password });
      toast.success("Account created successfully!");
      navigate("/chat");
    } catch (error) {
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950">
      <Navbar />

      <div className="flex-1 flex justify-center items-center">
        {loading && <Spinner />}
        <form
          onSubmit={handleRegister}
          className="bg-gray-900 p-8 rounded-2xl shadow-lg w-full max-w-md"
        >
          <h2 className="text-3xl font-bold mb-6 text-center text-white">Register</h2>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
          <div className="relative mb-6">
                      <input
                      type={showPassword? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full mb-4 px-4 py-3 rounded-xl bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-yellow-400"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute top-1/4 right-3 flex items-center text-gray-500 hover:text-gray-400"
                      >
                        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
                      </button>
                    </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-indigo-500 text-black rounded-xl font-semibold hover:bg-indigo-400 transition"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>
      </div>

      <Footer />
    </div>
  );
}
