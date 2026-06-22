import React, { useRef, useState, useEffect } from "react";
import { Globe, Moon, Sun, Heart, ArrowRight, User, Mail, Lock, Droplet, Building2, Eye, EyeOff, Loader2, HeartPulse, ShieldCheck, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";
import MapPicker from "../components/MapPicker";
import toast from "react-hot-toast";

const Login = () => {
  const navigate = useNavigate();
  const { darkMode, toggleDarkMode } = useTheme();
  const { login, register } = useAuth();

  const emailRef = useRef(null);

  const [language, setLanguage] = useState("EN");
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Register States
  const [name, setName] = useState("");
  const [role, setRole] = useState("Donor");
  const [bloodGroup, setBloodGroup] = useState("");
  const [location, setLocation] = useState({ address: "", lat: 20.5937, lng: 78.9629 });

  const [hospitalName, setHospitalName] = useState("");
  const [licenseNumber, setLicenseNumber] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPendingPopup, setShowPendingPopup] = useState(false);

  // Prevent admin registration
  useEffect(() => {
    if (!isLogin && role === "Admin") {
      setRole("Donor");
    }
  }, [isLogin, role]);

  const handleSearchAddress = async () => {
    if (!location.address) {
      toast.error("Please enter an address to search");
      return;
    }
    try {
      toast.loading("Searching location...", { id: "search" });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(location.address)}&countrycodes=in`);
      const data = await response.json();
      if (data && data.length > 0) {
        const firstResult = data[0];
        setLocation({
          ...location,
          lat: parseFloat(firstResult.lat),
          lng: parseFloat(firstResult.lon),
          address: firstResult.display_name
        });
        toast.success("Location found!", { id: "search" });
      } else {
        toast.error("Location not found on map", { id: "search" });
      }
    } catch (err) {
      toast.error("Failed to search location", { id: "search" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const user = await login(email, password);

        // Redirect based on actual user role from DB, ignoring the UI tab just to be safe
        switch (user?.role?.toLowerCase()) {
          case "admin":
            navigate("/admin");
            break;
          case "hospital":
            navigate("/hospital");
            break;
          default:
            navigate("/donor");
        }
      } else {
        const payload = {
          name,
          email,
          password,
          role,
        };

        if (role === "Donor") {
          payload.bloodGroup = bloodGroup;
          payload.address = location.address;
          payload.latitude = location.lat;
          payload.longitude = location.lng;
        }

        if (role === "Hospital") {
          payload.hospitalName = hospitalName;
          payload.licenseNumber = licenseNumber;
        }

        const response = await register(payload);
        const registeredUser = response.user;

        if (registeredUser?.role === "Hospital" && registeredUser?.status === "Pending") {
          setShowPendingPopup(true);
        } else {
          switch (registeredUser?.role?.toLowerCase()) {
            case "admin":
              navigate("/admin");
              break;
            case "hospital":
              navigate("/hospital");
              break;
            default:
              navigate("/donor");
          }
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message || "Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  const inputClasses = `w-full pl-10 pr-4 py-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-300 ${
    darkMode 
      ? "bg-gray-800/50 border-gray-700 text-white placeholder-gray-400 focus:bg-gray-800" 
      : "bg-white/50 border-gray-200 text-gray-900 placeholder-gray-400 focus:bg-white"
  }`;

  const iconClasses = `absolute left-3 top-3.5 h-5 w-5 ${darkMode ? "text-gray-400" : "text-gray-500"}`;

  return (
    <div
      className={`min-h-screen flex items-center justify-center p-4 sm:p-8 transition-colors duration-500 relative overflow-hidden ${
        darkMode ? "bg-gray-950 text-white" : "bg-rose-50 text-gray-900"
      }`}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut" }}
          className={`absolute -top-[20%] -left-[10%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] ${
            darkMode ? "bg-red-900/20" : "bg-red-300/40"
          }`} 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
          className={`absolute -bottom-[20%] -right-[10%] w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] ${
            darkMode ? "bg-rose-900/20" : "bg-rose-300/40"
          }`} 
        />
      </div>

      {/* Main Container */}
      <motion.div 
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`relative z-10 w-full max-w-5xl rounded-[2.5rem] overflow-hidden shadow-2xl flex flex-col md:flex-row backdrop-blur-xl border ${
          darkMode 
            ? "bg-gray-900/70 border-gray-800/80 shadow-red-900/5" 
            : "bg-white/70 border-white/80 shadow-rose-200/50"
        }`}
      >
        {/* Left Branding Side (Hidden on Mobile) */}
        <div className={`hidden md:flex md:w-5/12 p-12 flex-col justify-between relative overflow-hidden ${
          darkMode ? "bg-gradient-to-br from-red-950 to-gray-900" : "bg-gradient-to-br from-rose-500 to-red-600"
        }`}>
          {/* Subtle pattern overlay */}
          <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>

          <div className="relative z-10">
            <motion.div 
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-3"
            >
              <div className="bg-white/20 p-2 rounded-xl backdrop-blur-sm">
                <HeartPulse className="text-white w-8 h-8" />
              </div>
              <h1 className="text-3xl font-bold text-white tracking-tight">RedHope</h1>
            </motion.div>
          </div>

          <div className="relative z-10 mt-12">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h2 className="text-4xl font-extrabold text-white leading-tight mb-4">
                Give the gift <br /> of life today.
              </h2>
              <p className={`text-lg mb-8 ${darkMode ? "text-gray-300" : "text-red-100"}`}>
                Join our community of heroes. Every drop counts in our mission to make blood available to everyone in need.
              </p>
              
              <div className="flex items-center gap-4">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className={`w-10 h-10 rounded-full border-2 ${darkMode ? "border-gray-900" : "border-red-600"} bg-gray-200 overflow-hidden flex items-center justify-center`}>
                      <User size={20} className="text-gray-400" />
                    </div>
                  ))}
                </div>
                <p className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-white"}`}>
                  Join 10,000+ donors
                </p>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Right Form Side */}
        <div className="w-full md:w-7/12 p-8 md:p-14 lg:p-16 flex flex-col justify-center relative">
          
          {/* Top Controls */}
          <div className="absolute top-6 right-6 flex items-center gap-3">
            <div className={`flex items-center rounded-full px-3 py-1.5 backdrop-blur-md border transition-colors ${
              darkMode ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50" : "bg-white/50 border-gray-200 hover:bg-white/80"
            }`}>
              <Globe size={14} className={darkMode ? "text-gray-400" : "text-gray-500"} />
              <select
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="bg-transparent text-xs font-medium ml-1 focus:outline-none cursor-pointer"
              >
                <option value="EN">EN</option>
                <option value="ES">ES</option>
                <option value="FR">FR</option>
              </select>
            </div>

            <button
              onClick={toggleDarkMode}
              className={`p-2 rounded-full backdrop-blur-md border transition-all duration-300 ${
                darkMode ? "bg-gray-800/50 border-gray-700 hover:bg-gray-700/50 text-yellow-400" : "bg-white/50 border-gray-200 hover:bg-white/80 text-gray-700"
              }`}
            >
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={darkMode ? "dark" : "light"}
                  initial={{ rotate: -90, opacity: 0 }}
                  animate={{ rotate: 0, opacity: 1 }}
                  exit={{ rotate: 90, opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {darkMode ? <Sun size={18} /> : <Moon size={18} />}
                </motion.div>
              </AnimatePresence>
            </button>
          </div>

          {/* Mobile Logo (Visible only on small screens) */}
          <div className="md:hidden flex items-center justify-center gap-2 mb-8 mt-4">
            <div className="bg-red-500 p-2 rounded-xl">
              <HeartPulse className="text-white w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight">RedHope</h1>
          </div>

          <div className="mb-6">
            <h2 className="text-3xl font-bold mb-2">
              {isLogin ? `Sign in as ${role}` : `Create ${role} account`}
            </h2>
            <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {isLogin 
                ? `Welcome back to the ${role} portal.` 
                : "Select your account type and fill in the details."}
            </p>
          </div>

          {/* Role Selector Tabs (Visible in both Login & Register) */}
          <div className={`flex p-1.5 rounded-xl mb-6 relative z-0 ${darkMode ? "bg-gray-800/60" : "bg-gray-100/80"}`}>
            {["Donor", "Hospital", "Admin"].map((r) => {
              if (!isLogin && r === "Admin") return null; // Admins can't register via public UI
              
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => {
                    setRole(r);
                    setBloodGroup("");
                    setHospitalName("");
                    setLicenseNumber("");
                  }}
                  className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-all duration-300 relative z-10 ${
                    role === r 
                      ? (darkMode ? "text-white" : "text-gray-900") 
                      : (darkMode ? "text-gray-400 hover:text-gray-300" : "text-gray-500 hover:text-gray-700")
                  }`}
                >
                  {role === r && (
                    <motion.div
                      layoutId="roleTab"
                      className={`absolute inset-0 rounded-lg -z-10 shadow-sm ${
                        darkMode ? "bg-gray-700" : "bg-white"
                      }`}
                      transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    />
                  )}
                  <span className="flex items-center justify-center gap-2">
                    {r === "Donor" && <Droplet size={14} />}
                    {r === "Hospital" && <Building2 size={14} />}
                    {r === "Admin" && <ShieldCheck size={14} />}
                    {r}
                  </span>
                </button>
              );
            })}
          </div>

          {error && (
            <motion.div 
              initial={{ opacity: 0, y: -10 }} 
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-100/80 backdrop-blur-sm border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-sm flex items-center gap-2"
            >
              <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
              {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="sync">
              {!isLogin && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5 overflow-hidden"
                >
                  {/* Common Name */}
                  <div className="relative">
                    <User className={iconClasses} />
                    <input
                      type="text"
                      placeholder="Full Name"
                      className={inputClasses}
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                    />
                  </div>

                  {/* Donor Specific */}
                  {role === "Donor" && (
                    <>
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="relative"
                      >
                        <Droplet className={iconClasses} />
                        <select
                          className={inputClasses}
                          value={bloodGroup}
                          onChange={(e) => setBloodGroup(e.target.value)}
                          required
                        >
                          <option value="" disabled>Select Blood Group</option>
                          <option value="A+">A+</option>
                          <option value="A-">A-</option>
                          <option value="B+">B+</option>
                          <option value="B-">B-</option>
                          <option value="AB+">AB+</option>
                          <option value="AB-">AB-</option>
                          <option value="O+">O+</option>
                          <option value="O-">O-</option>
                        </select>
                      </motion.div>
                      
                      {/* Donor Location Selection */}
                      <motion.div 
                        initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                        className="space-y-3"
                      >
                        <label className={`text-sm font-medium ${darkMode ? "text-gray-300" : "text-gray-700"}`}>Your Location (Used to notify you of nearby requests)</label>
                        <div className="flex gap-2">
                          <div className="relative flex-1">
                            <MapPin className={iconClasses} />
                            <input
                              type="text"
                              placeholder="Enter your address"
                              className={inputClasses}
                              value={location.address}
                              onChange={(e) => setLocation({ ...location, address: e.target.value })}
                              required
                            />
                          </div>
                          <button
                            type="button"
                            onClick={handleSearchAddress}
                            className={`px-4 py-3 rounded-xl font-semibold transition-colors ${darkMode ? "bg-gray-800 hover:bg-gray-700 text-white border border-gray-700" : "bg-gray-100 hover:bg-gray-200 text-gray-800 border border-gray-300"}`}
                          >
                            Search Map
                          </button>
                        </div>
                        <div className="w-full">
                          <MapPicker location={location} setLocation={setLocation} />
                        </div>
                      </motion.div>
                    </>
                  )}

                  {/* Hospital Specific */}
                  {role === "Hospital" && (
                    <motion.div 
                      initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                      className="space-y-5"
                    >
                      <div className="relative">
                        <Building2 className={iconClasses} />
                        <input
                          type="text"
                          placeholder="Hospital / Organization Name"
                          className={inputClasses}
                          value={hospitalName}
                          onChange={(e) => setHospitalName(e.target.value)}
                          required
                        />
                      </div>
                      <div className="relative">
                        <Heart className={iconClasses} />
                        <input
                          type="text"
                          placeholder="Medical License Number"
                          className={inputClasses}
                          value={licenseNumber}
                          onChange={(e) => setLicenseNumber(e.target.value)}
                          required
                        />
                      </div>
                    </motion.div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Always Visible Fields (Email & Password) */}
            <div className="relative">
              <Mail className={iconClasses} />
              <input
                ref={emailRef}
                type="email"
                placeholder={`${role === "Hospital" ? "Organization Email" : "Email Address"}`}
                className={inputClasses}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <Lock className={iconClasses} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className={inputClasses}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button
                type="button"
                className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            {isLogin && (
              <div className="flex justify-end mt-2">
                <button type="button" className={`text-sm font-medium hover:underline transition-all ${darkMode ? "text-red-400" : "text-red-600"}`}>
                  Forgot password?
                </button>
              </div>
            )}

            <button
              disabled={loading}
              className={`w-full mt-6 flex items-center justify-center gap-2 py-3.5 px-4 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none ${
                darkMode 
                  ? "bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 shadow-red-900/40" 
                  : "bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 shadow-red-500/30"
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Please wait...</span>
                </>
              ) : (
                <>
                  <span>{isLogin ? `Sign In to ${role}` : `Create ${role} Account`}</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          {/* Toggle Login/Register */}
          <div className="mt-8 text-center">
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-600"}`}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
              <button
                type="button"
                className={`font-semibold hover:underline transition-all ${
                  darkMode ? "text-red-400 hover:text-red-300" : "text-red-600 hover:text-red-700"
                }`}
                onClick={() => {
                  if (isLogin && role === "Admin") {
                    setRole("Donor"); // If switching to signup from Admin, switch to Donor
                  }
                  setIsLogin(!isLogin);
                }}
              >
                {isLogin ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>

        </div>
      </motion.div>

      {/* Hospital Pending Approval Popup */}
      <AnimatePresence>
        {showPendingPopup && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              className="bg-white dark:bg-slate-900 rounded-3xl max-w-md w-full p-8 shadow-2xl text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-amber-400 to-orange-500"></div>
              
              <div className="w-20 h-20 bg-amber-100 dark:bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500">
                <ShieldCheck size={40} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-3">Registration Successful!</h3>
              
              <p className="text-slate-600 dark:text-slate-300 mb-8 leading-relaxed">
                Thank you for joining RedHope. Your hospital account is currently <span className="font-semibold text-amber-500">pending admin approval</span>. 
                <br /><br />
                We are reviewing your medical license and organization details. Once verified, you will be able to log in and manage blood requests.
              </p>
              
              <button
                onClick={() => {
                  setShowPendingPopup(false);
                  setIsLogin(true); // Switch to login screen
                }}
                className="w-full py-3.5 bg-gradient-to-r from-red-500 to-rose-500 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-red-500/30 transition-all"
              >
                Return to Login
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Login;
