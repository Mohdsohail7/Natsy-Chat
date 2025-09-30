// src/pages/ResendVerification.jsx
import React, { useState } from "react";
import { resendVerification } from "../api/auth";

export default function ResendVerification() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);

  const handleResendEmail = async (e) => {
    e.preventDefault();
    setStatus("loading");
    try {
      await resendVerification(email);
      setStatus("success");
    } catch (err) {
      setStatus("error");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950">
      <div className="bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950 shadow-md rounded-lg p-8 max-w-md w-full text-center">
        <h1 className="text-xl font-bold mb-4 text-gray-100">Resend Verification Email</h1>

        {status === "success" ? (
          <p className="text-green-600">
            Verification email has been resent. Please check your inbox!
          </p>
        ) : (
          <form onSubmit={handleResendEmail}>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="border rounded w-full px-3 py-2 mb-4 bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950
              text-white focus:outline-none focus:ring-2 focus:ring-gray-600"
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={status === "loading"}
            >
              {status === "loading" ? "Sending..." : "Resend Email"}
            </button>
          </form>
        )}

        {status === "error" && (
          <p className="text-red-600 mt-4">
            Failed to resend verification email. Please try again.
          </p>
        )}
      </div>
    </div>
  );
}
