import React, { useEffect, useState } from "react";
import axios from "axios";
// Note: This component assumes you have react-router-dom set up
import { useNavigate } from "react-router-dom"; 

// This is the App component that will contain all the logic and rendering.
const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      const token = localStorage.getItem("access");
      if (!token) {
        navigate("/login");
        return;
      }

      try {
        const response = await axios.get("http://127.0.0.1:8000/api/auth/profile/", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setUser(response.data);
      } catch (error) {
        console.error(error.response?.data || error.message);
        navigate("/login");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
          <p className="text-gray-600 text-lg">Loading user profile...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-sm text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">User Profile</h1>
        <p className="text-lg text-gray-700 mb-4">
          <b className="font-semibold text-gray-900">Username:</b> {user.username}
        </p>
        <button
          onClick={() => {
            localStorage.removeItem("access");
            localStorage.removeItem("refresh");
            navigate("/login");
          }}
          className="w-full py-3 mt-4 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700 transition-colors duration-300 ease-in-out"
        >
          Log Out
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
