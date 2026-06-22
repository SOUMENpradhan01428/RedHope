import React from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { HeartPulse, Droplet, Users, ShieldCheck, ArrowRight, Building2, Globe, Activity, ChevronRight, Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const LandingPage = () => {
  const { darkMode, toggleDarkMode } = useTheme();

  return (
    <div className={`min-h-screen ${darkMode ? "bg-slate-950 text-slate-200" : "bg-slate-50 text-slate-800"} font-sans overflow-x-hidden transition-colors duration-500`}>
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 w-full z-50 transition-all duration-300 ${darkMode ? "bg-slate-900/90 border-slate-800" : "bg-white/90 border-slate-200"} backdrop-blur-lg border-b`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-tr from-red-500 to-rose-600 p-2 rounded-xl shadow-lg shadow-red-500/20">
                <HeartPulse className="text-white w-6 h-6" />
              </div>
              <span className="text-2xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
                RedHope
              </span>
            </div>
            
            {/* Nav Links */}
            <div className="hidden md:flex items-center" style={{ gap: "2.5rem" }}>
              <a href="#features" className={`font-bold text-sm tracking-widest hover:text-red-500 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>FEATURES</a>
              <a href="#how-it-works" className={`font-bold text-sm tracking-widest hover:text-red-500 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>HOW IT WORKS</a>
              <a href="#impact" className={`font-bold text-sm tracking-widest hover:text-red-500 transition-colors ${darkMode ? "text-slate-300" : "text-slate-600"}`}>OUR IMPACT</a>
            </div>
            
            {/* Actions */}
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className="p-2.5 rounded-full border transition-all duration-300 shadow-sm hover:scale-105"
                style={{
                  backgroundColor: darkMode ? "#1e293b" : "#f8fafc",
                  borderColor: darkMode ? "#334155" : "#e2e8f0",
                  color: darkMode ? "#facc15" : "#475569",
                }}
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
              
              <Link 
                to="/login"
                className="px-6 py-2.5 rounded-full font-bold shadow-xl transition-all duration-300 flex items-center gap-2 hover:scale-105"
                style={{
                  backgroundColor: darkMode ? "#ffffff" : "#0f172a",
                  color: darkMode ? "#0f172a" : "#ffffff",
                }}
              >
                Sign In <ChevronRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="relative overflow-hidden" style={{ paddingTop: "140px", paddingBottom: "80px" }}>
        {/* Background glow effects - properly positioned behind content */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none -z-10">
          <div className="absolute -top-24 -left-24 w-96 h-96 bg-red-500/10 rounded-full blur-[100px]" />
          <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-rose-500/5 rounded-full blur-[120px]" />
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 mt-10">
          <div className="text-center max-w-4xl mx-auto flex flex-col items-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex w-max items-center gap-2 px-5 py-2 rounded-full font-semibold text-sm mb-8 border shadow-sm"
              style={{
                backgroundColor: darkMode ? "rgba(239, 68, 68, 0.1)" : "#fef2f2",
                borderColor: darkMode ? "rgba(239, 68, 68, 0.2)" : "#fee2e2",
                color: darkMode ? "#f87171" : "#dc2626",
              }}
            >
              <Activity size={16} className="animate-pulse" />
              <span>Saving lives across the globe</span>
            </motion.div>

            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className={`text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-tight ${darkMode ? "text-white" : "text-slate-900"}`}
            >
              Every Drop Brings <br className="hidden md:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-rose-500">New Hope.</span>
            </motion.h1>

            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className={`text-lg lg:text-xl mb-10 max-w-2xl mx-auto leading-relaxed ${darkMode ? "text-slate-400" : "text-slate-500"}`}
            >
              RedHope bridges the gap between generous donors and critical patients. 
              Join the largest modern network of blood banks, hospitals, and everyday heroes.
            </motion.p>

            <motion.div 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row justify-center items-center mt-6"
              style={{ gap: "1rem" }}
            >
              <Link 
                to="/login"
                className="w-full sm:w-auto px-8 py-4 rounded-xl font-bold text-white bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-xl shadow-red-500/20 hover:shadow-red-500/40 transition-all duration-300 flex items-center justify-center gap-2 transform hover:-translate-y-1"
              >
                <Droplet size={20} /> Become a Donor
              </Link>
              <Link 
                to="/login"
                className={`w-full sm:w-auto px-8 py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all duration-300 border-2 transform hover:-translate-y-1 ${
                  darkMode 
                    ? "border-slate-700 text-white hover:bg-slate-800" 
                    : "border-slate-200 text-slate-800 hover:bg-slate-100 hover:border-slate-300"
                }`}
              >
                <Building2 size={20} /> Register Hospital
              </Link>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className={`py-24 ${darkMode ? "bg-slate-900/50" : "bg-white"}`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className={`text-3xl md:text-4xl font-extrabold mb-4 ${darkMode ? "text-white" : "text-slate-900"}`}>Why Choose RedHope?</h2>
            <p className={`text-lg max-w-2xl mx-auto ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
              Our platform uses advanced algorithms to match donors with exact requirements instantly, ensuring no time is wasted in emergencies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3" style={{ gap: "2rem" }}>
            {[
              { icon: <Activity size={28} />, title: "Instant Matching", desc: "Our algorithm finds the nearest eligible donors for urgent requests instantly, saving critical time.", color: "text-rose-500", bg: "bg-rose-50 dark:bg-rose-500/10", border: "border-rose-100 dark:border-rose-500/20" },
              { icon: <ShieldCheck size={28} />, title: "Secure & Verified", desc: "Every hospital and blood bank is strictly verified to ensure complete safety and trust in the network.", color: "text-emerald-500", bg: "bg-emerald-50 dark:bg-emerald-500/10", border: "border-emerald-100 dark:border-emerald-500/20" },
              { icon: <Globe size={28} />, title: "Global Network", desc: "Connected with thousands of medical facilities worldwide for seamless logistics and communication.", color: "text-blue-500", bg: "bg-blue-50 dark:bg-blue-500/10", border: "border-blue-100 dark:border-blue-500/20" }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                whileHover={{ y: -5 }}
                className={`p-8 rounded-3xl border transition-all duration-300 flex flex-col items-start text-left ${
                  darkMode ? "bg-slate-900 border-slate-800 shadow-xl shadow-slate-900/50" : "bg-white border-slate-100 shadow-xl shadow-slate-200/40"
                }`}
              >
                <div className={`w-14 h-14 shrink-0 rounded-2xl flex items-center justify-center mb-6 border ${feature.bg} ${feature.color} ${feature.border}`}>
                  {feature.icon}
                </div>
                <h3 className={`text-xl font-bold mb-3 w-full ${darkMode ? "text-white" : "text-slate-900"}`}>{feature.title}</h3>
                <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} leading-relaxed flex-grow w-full`}>{feature.desc}</p>
                
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 w-full">
                  <div className="flex items-center text-sm font-semibold text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer transition-colors">
                    Learn more <ArrowRight size={16} className="ml-1" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className={`${darkMode ? "bg-slate-950 border-slate-900" : "bg-slate-900 border-slate-800"} py-12 border-t mt-auto`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <HeartPulse className="text-red-500 w-6 h-6" />
            <span className="text-xl font-bold text-white tracking-tight">RedHope</span>
          </div>
          <p className="text-slate-400 text-sm font-medium">
            © {new Date().getFullYear()} RedHope Network. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <a href="#" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Privacy</a>
            <a href="#" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Terms</a>
            <a href="#" className="text-slate-400 hover:text-white text-sm font-medium transition-colors">Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
