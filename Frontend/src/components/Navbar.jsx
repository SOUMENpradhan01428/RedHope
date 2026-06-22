import React, { useState, useEffect } from "react";
import { Bell, Sun, Moon, LogOut } from "lucide-react";
import { Avatar } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { notificationAPI } from "../services/api";

const Navbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { user, logout: authLogout } = useAuth();
  const [unreadNotifs, setUnreadNotifs] = useState(0);

  const username = user?.name || localStorage.getItem("name") || "Guest";
  const role = user?.role || localStorage.getItem("role") || "User";

  useEffect(() => {
    notificationAPI.getAll()
      .then((data) => setUnreadNotifs(data.unreadCount))
      .catch(() => {});
  }, [user]);

  const handleLogout = () => {
    authLogout();
    navigate("/");
  };

  return (
    <div
      className={`flex justify-between items-center px-6 py-3 border-b transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-white text-gray-800 border-gray-200"
      }`}
    >
      <div
        className="flex items-center gap-2 cursor-pointer"
        onClick={() => navigate("/")}
      >
        <img
          src="https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1fac0.png"
          className="h-[40px]"
        />
        <span className="text-red-500 text-2xl font-bold">RedHope</span>
      </div>

      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Bell
            onClick={() => navigate("/notifications")}
            className={`cursor-pointer ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            size={20}
          />
          {unreadNotifs > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
              {unreadNotifs}
            </span>
          )}
        </div>

        <div className={`border-r h-6 ${darkMode ? "border-gray-600" : "border-gray-300"}`}></div>

        <div className={`border-r h-6 ${darkMode ? "border-gray-600" : "border-gray-300"}`}></div>

        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-md ${
            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {darkMode ? <Sun className="text-yellow-400" size={18} /> : <Moon className="text-gray-600" size={18} />}
        </button>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2 py-1 rounded-md ${
            darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-600"
          }`}
        >
          {role}
        </span>
        <span className="font-medium hidden sm:block">{username}</span>
        <Avatar
          onClick={() => user?.role !== "Admin" && navigate("/profile")}
          sx={{ width: 32, height: 32, bgcolor: "#ef4444", color: "white", cursor: user?.role !== "Admin" ? "pointer" : "default" }}
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>
        <button
          onClick={handleLogout}
          className={`px-3 py-1 rounded-md flex items-center gap-1 ${
            darkMode ? "bg-gray-800 hover:bg-gray-700" : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
