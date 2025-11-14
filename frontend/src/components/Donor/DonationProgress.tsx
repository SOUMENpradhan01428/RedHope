

import React from "react";
import { useTheme } from "../../context/ThemeContext";

const DonationProgress: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h3 className="font-semibold mb-1">🏅 Donation Progress</h3>
      <p
        className={`text-sm mb-3 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Your journey to becoming a super donor
      </p>

      <p className="text-sm font-medium mb-1">
        Next Level (Level 5):{" "}
        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
          1250/1500 points
        </span>
      </p>
      <div
        className={`w-full h-2 rounded-full mb-3 ${
          darkMode ? "bg-gray-700" : "bg-gray-200"
        }`}
      >
        <div className="bg-red-500 h-2 rounded-full w-[83%]"></div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>Regular Donor Badge</span>
          <span className="text-green-600 border border-green-500 px-2 py-0.5 rounded-full text-xs">
            Earned
          </span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Hero Donor Badge</span>
          <span className="text-gray-400 text-xs">2 more donations</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>Lifetime Saver Badge</span>
          <span className="text-gray-400 text-xs">17 more donations</span>
        </div>
      </div>
    </div>
  );
};

export default DonationProgress;
