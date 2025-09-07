import './App.css';
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import { useEffect, useState } from 'react';
import Spinner from './components/Spinner';

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Router>
      { loading && <Spinner />}
      <Routes>
        {/* Home / Landing Page */}
        <Route path="/" element={<HomePage />} />

        {/* Other pages will come later */}
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/register" element={<div>Register Page</div>} />
        <Route path="/guest-chat" element={<div>Guest Chat Page</div>} />
      </Routes>
    </Router>
  );
}

export default App;
