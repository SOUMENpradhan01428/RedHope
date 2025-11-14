import React, { useRef } from "react";
import { Globe, Moon, Sun, Heart } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
// import { useTheme } from "../../context/ThemeContext";

const Login: React.FC = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const emailRef = useRef<HTMLInputElement | null>(null);
  const [language, setLanguage] = React.useState("EN");
  const [role, setRole] = React.useState("Donor");
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [login, setLogin] = React.useState(1); // 1 = Login, 0 = SignUp

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (role === "Admin") navigate("/admin");
    else if (role === "Donor") navigate("/donor");
    else navigate("/hospital");
  };

  return (
    <div
      className={`min-h-screen flex flex-col items-center justify-center transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-rose-50 text-gray-800"
      }`}
    >
      {/* Logo */}
      <div className="text-center mb-4">
        <div className="flex justify-center items-center gap-2">
          <Heart className="text-red-500" size={24} />
          <h1 className="text-2xl font-semibold">RedHope</h1>
        </div>
        <p
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
        >
          Smart Blood Donation Platform
        </p>
      </div>

      {/* Controls */}
      <div className="flex items-center gap-3 mb-4">
        {/* Language Selector */}
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
            className={`bg-transparent focus:outline-none text-sm ${
              darkMode ? "text-gray-300" : "text-gray-700"
            }`}
          >
            <option>EN</option>
            <option>FR</option>
            <option>HI</option>
          </select>
        </div>

        {/* Theme Toggle */}
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

      {/* Login Card */}
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
          <p
            className={`${
              darkMode ? "text-gray-400" : "text-gray-500"
            } text-xs`}
          >
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
              placeholder="example@mail.com"
              ref={emailRef}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
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
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
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
              className={`w-full border rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 ${
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

          <button
            type="submit"
            className="mt-2 bg-red-500 hover:bg-red-600 text-white py-2 rounded-md text-sm flex justify-center items-center gap-1"
          >
            <Heart size={14} /> <span>{login === 1 ? "Login" : "Sign Up"}</span>
          </button>
        </form>

        <p className="text-center text-sm mt-4">
          {login === 1 ? (
            <span>
              Don’t have an account?{" "}
              <button
                onClick={() => setLogin(0)}
                className="text-red-500 hover:underline"
              >
                Sign up
              </button>
            </span>
          ) : (
            <span>
              Already have an account?{" "}
              <button
                onClick={() => setLogin(1)}
                className="text-red-500 hover:underline"
              >
                Login
              </button>
            </span>
          )}
        </p>
      </div>

      {/* Footer */}
      <p
        className={`fixed bottom-2 right-4 text-xs ${
          darkMode ? "text-gray-600" : "text-gray-400"
        }`}
      >
      
      </p>
    </div>
  );
};

export default Login;
