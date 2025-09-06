import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400 text-lg">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-neutral-900 p-8 rounded-2xl shadow-lg w-full max-w-sm text-center">
        <img
          src={`https://ui-avatars.com/api/?name=${user.username}&background=000000&color=ffffff&size=128`}
          alt="Profile"
          className="w-28 h-28 mx-auto rounded-full mb-6 border border-gray-700"
        />
        <h1 className="text-2xl font-semibold text-white">{user.username}</h1>
        <p className="text-gray-400 mt-2">Welcome back 👋</p>
      </div>
    </div>
  );
};

export default ProfilePage;
