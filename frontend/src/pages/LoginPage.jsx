import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 

const LoginPage = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState(null);
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        setMessage(null);
        setIsError(false);
      }, 5000); 
      return () => clearTimeout(timer);
    }
  }, [message]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setIsError(false);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/auth/token/", {
        username,
        password,
      });

      localStorage.setItem("access", response.data.access);
      localStorage.setItem("refresh", response.data.refresh);
      setMessage("Login successful!");
      
      navigate("/dashboard");
    } catch (error) {
      console.error(error.response?.data || error.message);
      setMessage("Login failed! Please check your credentials.");
      setIsError(true);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4"> {/* Dark background */}
      <div className="bg-gray-800 p-8 rounded-xl shadow-2xl w-full max-w-sm border border-gray-700"> {/* Darker card, subtle border */}
        <div className="flex flex-col items-center mb-8"> {/* Logo container */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-12 w-12 text-gray-200 mb-2" // Larger icon
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
            >
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 17h10a2 2 0 002-2V9a2 2 0 00-2-2H7a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
            </svg>
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Electric CMS</h1> {/* Prominent title */}
            <p className="text-gray-400 mt-2 text-sm">Your reliable customer management system</p>
        </div>
        
        {/* Message Box */}
        {message && (
          <div className={`p-4 rounded-lg mb-6 text-center font-medium ${isError ? 'bg-red-800 text-red-100' : 'bg-green-800 text-green-100'}`}> {/* Adjusted message box colors for dark theme */}
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5"> {/* Increased spacing */}
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-colors duration-200" // Darker inputs
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full p-3 border border-gray-600 bg-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 placeholder-gray-400 transition-colors duration-200" // Darker inputs
          />
          <button
            type="submit"
            className="w-full py-3 mt-6 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out uppercase tracking-wide" // Adjusted button style
          >
            Log In
          </button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;