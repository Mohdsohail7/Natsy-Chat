import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from 'react';
import Spinner from './components/Spinner';
import { Toaster } from 'react-hot-toast';
import Login from './pages/Login';
import Register from './pages/Register';
import Chat from './pages/Chat';
import EmailVerified from './pages/EmailVerified';
import ResendVerification from './pages/ResendVerification';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      { loading && <Spinner />}
      <Toaster
        position="top-center"
        toastOptions={{
          duration: 2500,
          style: {
            background: "#1e293b", // dark slate background
            color: "#e2e8f0", // light gray text
            borderRadius: "12px",
            padding: "12px 18px",
            fontSize: "16px",
            fontWeight: "600",
          },
          success: {
            style: {
              background: "#0f172a", // deep navy
              color: "#38bdf8", // sky blue text
            },
            iconTheme: {
              primary: "#38bdf8", // blue
              secondary: "#0f172a", // dark navy bg
            },
          },
          error: {
            style: {
              background: "#450a0a", // dark red
              color: "#fca5a5", // light red text
            },
            iconTheme: {
              primary: "#f87171", // soft red
              secondary: "#450a0a", // dark bg
            },
          },
        }}
      />

      <Routes>
        {/* Home / Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Other pages will come later */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Email verification routes */}
        <Route path="/email-verified/:token" element={<EmailVerified />} />
        <Route path="/resend-verification" element={<ResendVerification />} />

        <Route path="/chat" element={<Chat />} />
      </Routes>
    </Router>
  );
}

export default App;
