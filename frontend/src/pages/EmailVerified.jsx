// src/pages/EmailVerified.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { verifyEmail } from "../api/auth";

export default function EmailVerified() {
  const { token } = useParams(); // from route like /email-verified/:token
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const handleVerifyEmail = async () => {
        try {
            await verifyEmail(token);
            setStatus("Success");
        } catch (error) {
            setStatus("error");
        }
    }

    handleVerifyEmail();
  }, [token]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950">
      <div className="bg-gradient-to-r from-blue-950 via-gray-900 to-slate-950 shadow-md rounded-lg p-8 max-w-md w-full text-center">
        {status === "loading" && (
          <p className="text-gray-500">Verifying your email...</p>
        )}
        {status === "success" && (
          <>
            <h1 className="text-green-600 text-2xl font-bold mb-4">
              Email Verified!
            </h1>
            <p className="text-gray-400 mb-6">
              Your account has been successfully verified. You can now log in.
            </p>
            <a
              href="/login"
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
            >
              Go to Login
            </a>
          </>
        )}
        {status === "error" && (
          <>
            <h1 className="text-red-600 text-2xl font-bold mb-4">
              Verification Failed
            </h1>
            <p className="text-gray-400 mb-6">
              This link is invalid or has expired. Please request a new one.
            </p>
            <a
              href="/resend-verification"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
            >
              Resend Verification Email
            </a>
          </>
        )}
      </div>
    </div>
  );
}
