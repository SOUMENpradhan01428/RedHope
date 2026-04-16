import React, { useRef, useState } from "react";
import { Globe, Moon, Sun, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";

const Login = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();

  const emailRef = useRef(null);

  const [language, setLanguage] = useState("EN");
  const [role, setRole] = useState("Donor");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [login, setLogin] = useState(1);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (role === "Admin") navigate("/admin");
    else if (role === "Donor") navigate("/donor");
    else navigate("/hospital");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center ${
        darkMode ? "bg-gray-900 text-white" : "bg-rose-50 text-gray-800"
      }`}
    >
      {/* Logo */}
      <div className="text-center mb-4">
        <div className="flex justify-center items-center gap-2">
          <Heart className="text-red-500" size={24} />
          <h1 className="text-2xl font-semibold">RedHope</h1>
        </div>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
          Smart Blood Donation Platform
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        <div
          className={`flex items-center border rounded-md px-2 py-1 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-300"
          }`}
        >
          <Globe size={16} className="text-gray-500 mr-1" />
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className={`bg-transparent text-sm ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <option>EN</option>
          </select>
        </div>

        <button
          onClick={toggleDarkMode}
          className={`border rounded-md p-2 ${
            darkMode
              ? "bg-gray-800 border-gray-600"
              : "bg-white border-gray-300"
          }`}
        >
          {darkMode ? (
            <Sun className="text-yellow-400" size={16} />
          ) : (
            <Moon className="text-gray-600" size={16} />
          )}
        </button>
      </div>

      {/* Card */}
      <div
        className={`w-full max-w-sm rounded-xl shadow-md p-6 ${
          darkMode
            ? "bg-gray-800 border border-gray-700"
            : "bg-white border border-gray-200"
        }`}
      >
        <div className="text-center mb-4">
          <div className="flex justify-center items-center gap-1 text-red-500">
            <Heart size={18} />
            <span className="font-semibold">
              {login === 1 ? "Login" : "Sign Up"}
            </span>
          </div>
          <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-xs`}>
            {login === 1
              ? "Welcome back to RedHope"
              : "Join the RedHope community"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              type="email"
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full border rounded-md px-3 py-2 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full border rounded-md px-3 py-2 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Role</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className={`w-full border rounded-md px-3 py-2 text-sm ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-200"
                  : "bg-white border-gray-300 text-gray-800"
              }`}
            >
              <option>Donor</option>
              <option>Admin</option>
              <option>Hospital</option>
            </select>
          </div>

          <button className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm flex justify-center items-center gap-1">
            <Heart size={14} /> {login === 1 ? "Login" : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {login === 1 ? (
            <>
              Don’t have an account?{" "}
              <button onClick={() => setLogin(0)} className="text-red-500">
                Sign up
              </button>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <button onClick={() => setLogin(1)} className="text-red-500">
                Login
              </button>
            </>
          )}
        </p>
      </div>
    </div>
  );
};

export default Login;