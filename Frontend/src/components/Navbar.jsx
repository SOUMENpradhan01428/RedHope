import React from "react";
import { Bell, Sun, Moon, Globe, LogOut } from "lucide-react";
import { Avatar, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Navbar = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const [language, setLanguage] = React.useState(
    localStorage.getItem("lang") || "EN"
  );

  const username = localStorage.getItem("name") || "Guest";
  const role = localStorage.getItem("role") || "User";

  const handleLogout = () => {
    localStorage.clear();
    navigate("/");
  };

const handleLanguageChange = (value) => {
  setLanguage(value);
  localStorage.setItem("lang", value);
};

  return (
    <div
      className={`flex justify-between items-center px-6 py-3 border-b transition-all duration-300 ${
        darkMode
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-white text-gray-800 border-gray-200"
      }`}
    >
      {/* Logo */}
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

      {/* Center Controls */}
      <div className="flex items-center gap-4">
        {/* Notifications */}
        <div className="relative">
          <Bell
            onClick={() => navigate("/notifications")}
            className={`cursor-pointer ${
              darkMode ? "text-gray-300" : "text-gray-600"
            }`}
            size={20}
          />
          {/* Badge */}
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">
            3
          </span>
        </div>

        <div
          className={`border-r h-6 ${
            darkMode ? "border-gray-600" : "border-gray-300"
          }`}
        ></div>

        {/* Language */}
            <div
  className={`flex items-center border rounded-md px-2 py-1 ${
    darkMode
      ? "bg-gray-800 border-gray-600"
      : "bg-white border-gray-300"
  }`}
>
  <Globe size={16} className="mr-1" />

  <Select
    value={language}
    onChange={(e) => handleLanguageChange(e.target.value)}
    size="small"
    className="text-sm"
    sx={{
      height: 28,
      fontSize: "0.8rem",
      color: darkMode ? "#e0e0e0" : "#333",
      ".MuiOutlinedInput-notchedOutline": { border: "none" },
    }}
  >
    <MenuItem value="EN">EN</MenuItem>
    <MenuItem value="IN">IN</MenuItem>
  </Select>
</div>


           

        {/* Theme */}
        <button
          onClick={toggleDarkMode}
          className={`p-2 rounded-md ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          {darkMode ? (
            <Sun className="text-yellow-400" size={18} />
          ) : (
            <Moon className="text-gray-600" size={18} />
          )}
        </button>
      </div>

      {/* User Section */}
      <div className="flex items-center gap-3">
        <span
          className={`text-xs px-2 py-1 rounded-md ${
            darkMode
              ? "bg-gray-800 text-gray-300"
              : "bg-gray-100 text-gray-600"
          }`}
        >
          {role}
        </span>

        <span className="font-medium hidden sm:block">
          {username}
        </span>

        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: "#ef4444",
            color: "white",
          }}
        >
          {username.charAt(0).toUpperCase()}
        </Avatar>

        <button
          onClick={handleLogout}
          className={`px-3 py-1 rounded-md flex items-center gap-1 ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700"
              : "bg-gray-100 hover:bg-gray-200"
          }`}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;