import React from "react";
import { Heart } from "lucide-react";
import { motion } from "framer-motion";

const LoadingFallback = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen w-full bg-rose-50 dark:bg-slate-950 transition-colors duration-500">
      <motion.div
        animate={{ 
          scale: [1, 1.15, 1],
        }}
        transition={{ 
          repeat: Infinity, 
          duration: 1.2, 
          ease: "easeInOut" 
        }}
        className="relative flex justify-center items-center"
      >
        <div className="absolute w-16 h-16 bg-red-500 rounded-full opacity-20 animate-ping" />
        <Heart className="w-12 h-12 text-red-500 fill-red-500 relative z-10 drop-shadow-lg" />
      </motion.div>
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mt-6 text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600"
      >
        RedHope
      </motion.h2>
      <motion.div 
        className="flex gap-1.5 mt-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.15 }}
            className="w-2 h-2 bg-red-400 rounded-full"
          />
        ))}
      </motion.div>
    </div>
  );
};

export default LoadingFallback;