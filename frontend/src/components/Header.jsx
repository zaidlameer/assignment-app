import React from 'react';
import { useNavigate } from "react-router-dom"; 

const Header = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem("access");
        localStorage.removeItem("refresh");
        navigate("/login");
    };  

    return (
        <header className="bg-gray-900 text-white p-4 shadow-md"> {/* Changed to dark gray/black */}
            <nav className="flex items-center justify-between max-w-7xl mx-auto">
                {/* Logo - Keeping it simple, perhaps a subtle icon or just text */}
                <div className="flex items-center space-x-2">
                    {/* You could simplify the SVG or use a different, more minimal icon */}
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-7 w-7 text-gray-200" // Adjusted icon color
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
                    <span className="text-xl font-semibold tracking-wide">Electric CMS</span> {/* Slightly smaller, wider tracking */}
                </div>

                {/* Navigation Links - Minimalist approach */}
                <div className="flex space-x-6 items-center">
                    <button
                        onClick={() => navigate("/dashboard")}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium uppercase tracking-wider" // Subtle text, uppercase
                    >
                        Dashboard
                    </button>
                    <button
                        onClick={() => navigate("/profile")}
                        className="text-gray-300 hover:text-white transition-colors duration-200 text-sm font-medium uppercase tracking-wider" // Subtle text, uppercase
                    >
                        Profile
                    </button>
                    <button
                        onClick={handleLogout}
                        className="px-4 py-2 bg-red-600 rounded-md shadow hover:bg-red-700 transition-colors duration-200 text-sm font-semibold uppercase" // Logout stands out
                    >
                        Log Out
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Header;