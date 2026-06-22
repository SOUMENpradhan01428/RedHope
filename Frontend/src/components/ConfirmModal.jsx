import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AlertTriangle, X } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", cancelText = "Cancel", isDanger = false }) => {
  const { darkMode } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-0">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5, bounce: 0.3 }}
            className={`relative w-full max-w-md p-6 overflow-hidden rounded-2xl shadow-2xl ${
              darkMode ? "bg-slate-900 border border-slate-700" : "bg-white border border-gray-100"
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={onClose}
              className={`absolute top-4 right-4 p-1 rounded-full transition-colors ${
                darkMode ? "text-gray-400 hover:bg-slate-800 hover:text-white" : "text-gray-400 hover:bg-gray-100 hover:text-gray-600"
              }`}
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center mt-2">
              <div
                className={`flex items-center justify-center w-16 h-16 rounded-full mb-4 ${
                  isDanger
                    ? darkMode ? "bg-red-900/30 text-red-500" : "bg-red-100 text-red-600"
                    : darkMode ? "bg-blue-900/30 text-blue-500" : "bg-blue-100 text-blue-600"
                }`}
              >
                <AlertTriangle size={32} />
              </div>

              <h3 className={`text-xl font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>
                {title}
              </h3>
              <p className={`text-sm mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
                {message}
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={onClose}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-medium transition-colors ${
                    darkMode
                      ? "bg-slate-800 text-gray-300 hover:bg-slate-700"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-2.5 px-4 rounded-xl font-medium text-white transition-all shadow-sm hover:shadow-md ${
                    isDanger
                      ? "bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 shadow-red-500/20"
                      : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-blue-500/20"
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
