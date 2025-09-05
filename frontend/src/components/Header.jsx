import React from 'react';
// Note: This component assumes you have react-router-dom set up
import { useNavigate } from "react-router-dom"; 

const Header = () => {
    const navigate = useNavigate();

    // Function to handle logout
    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    };

    return (
        <header className="bg-blue-600 text-white p-4 shadow-lg">
            <nav className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo */}
                <div className="flex items-center space-x-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-8 w-8 text-blue-100"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                        />
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                    </svg>
                    <span className="text-2xl font-bold">Electronics Shop</span>
                </div>

                {/* Navigation Links */}
                <div className="flex space-x-6 items-center">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="text-white hover:text-blue-200 transition-colors duration-200 font-medium"
                    >
                        Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-blue-700 rounded-lg shadow hover:bg-blue-800 transition-colors duration-200 font-semibold"
                    >
                        Log Out
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;
