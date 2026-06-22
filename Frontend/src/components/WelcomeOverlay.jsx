import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const WelcomeOverlay = ({ role, userName }) => {
  const [show, setShow] = useState(() => {
    // Only show if the login/register specifically set the flag
    return sessionStorage.getItem("showWelcome") === "true";
  });

  useEffect(() => {
    if (show) {
      // Immediately clear so it doesn't show again on refresh
      sessionStorage.removeItem("showWelcome");
      
      const timer = setTimeout(() => {
        setShow(false);
      }, 3500); // 3.5 seconds total display time
      
      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, y: -50, scale: 0.95, filter: "blur(10px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gradient-to-br from-red-600 via-rose-700 to-red-900"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6, type: "spring" }}
            className="flex flex-col items-center"
          >
            <motion.div 
              initial={{ rotate: -180, scale: 0 }}
              animate={{ rotate: 0, scale: 1 }}
              transition={{ delay: 0.4, duration: 0.8, type: "spring", bounce: 0.5 }}
              className="w-28 h-28 bg-white rounded-full flex items-center justify-center shadow-2xl mb-8"
            >
              <span className="text-6xl drop-shadow-md">❤️</span>
            </motion.div>
            
            <motion.h1 
              initial={{ y: 30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="text-5xl md:text-6xl font-extrabold text-white mb-4 tracking-tight drop-shadow-lg"
            >
              Welcome to RedHope
            </motion.h1>
            
            <motion.p 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.5 }}
              className="text-2xl md:text-3xl text-rose-100 font-medium drop-shadow"
            >
              Logging in as <span className="font-bold capitalize text-white">{role}</span>...
            </motion.p>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.6, duration: 0.5 }}
              className="text-xl text-white mt-3 font-semibold bg-white/20 px-6 py-2 rounded-full shadow-inner"
            >
              Hello, {userName}!
            </motion.p>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "250px" }}
              transition={{ delay: 2.0, duration: 1, ease: "easeInOut" }}
              className="h-1.5 bg-white rounded-full mt-12 shadow-lg"
            />
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default WelcomeOverlay;
