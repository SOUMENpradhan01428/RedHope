import React from "react";
import { Bell, Sun, Moon, Globe, LogOut } from "lucide-react";
import { Avatar, MenuItem, Select } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext"; // ✅ Import custom hook

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme(); // ✅ use global theme
  const [language, setLanguage] = React.useState("EN");

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <div
      className={`flex justify-between items-center transition-all duration-300 px-6 py-3 border-b ${
        darkMode
          ? "bg-gray-900 text-white border-gray-700"
          : "bg-white text-gray-800 border-gray-200"
      }`}
    >
      {/* Left side */}
      <div className="flex items-center gap-2">
        <span className="text-red-500 text-4xl font-bold flex flex-wrap items-center">
          <img
            src="https://images.emojiterra.com/google/noto-emoji/unicode-15/color/512px/1fac0.png"
            alt=""
            className="h-[45px]"
          />
          <span className="ml-1">RedHope</span>
        </span>
      </div>

      {/* Middle icons */}
      <div className="flex items-center gap-4">
        <Bell
          className={`cursor-pointer ${
            darkMode ? "text-gray-300" : "text-gray-600"
          }`}
          size={20}
        />
        <div
          className={`border-r h-6 ${
            darkMode ? "border-gray-600" : "border-gray-300"
          }`}
        ></div>

        {/* Language Selector */}
        <div
          className={`flex items-center border rounded-md px-2 py-1 ${
            darkMode
              ? "bg-gray-800 border-gray-600 text-gray-200"
              : "bg-white border-gray-300 text-gray-800"
          }`}
        >
          <Globe size={16} className="mr-1" />
          <Select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            size="small"
            className="!text-sm"
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

        {/* Theme Toggle */}
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

      {/* Right user section */}
      <div className="flex items-center gap-3">
        <span
          className={`text-sm px-2 py-1 rounded-md ${
            darkMode ? "bg-gray-800 text-gray-300" : "bg-gray-100 text-gray-500"
          }`}
        >
          hospital
        </span>
        <span className="font-medium">soumen pradhan</span>
        <Avatar
          sx={{
            width: 32,
            height: 32,
            bgcolor: darkMode ? "#E57373" : "#F44336",
            color: "white",
          }}
        >
          A
        </Avatar>
        <button
          onClick={handleLogout}
          className={`px-3 py-1 rounded-md flex items-center gap-1 transition ${
            darkMode
              ? "bg-gray-800 hover:bg-gray-700 text-gray-200"
              : "bg-gray-100 hover:bg-gray-200 text-gray-800"
          }`}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
