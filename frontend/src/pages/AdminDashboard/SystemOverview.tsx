

import React from "react";
import DonationTrendsChart from "../../components/Admin/DonationTrendsChart";
import UserGrowthChart from "../../components/Admin/UserGrowthChart";
import { useTheme } from "../../context/ThemeContext";

const SystemOverview: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      {/* Donation Trends */}
      <div
        className={`p-5 rounded-xl shadow-sm border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3 className="font-semibold">❤️ Donation Trends</h3>
        <p
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
        >
          Monthly donations vs requests
        </p>
        <div className="mt-10 h-52 rounded-lg flex items-center justify-center">
          <DonationTrendsChart />
        </div>
      </div>

      {/* User Growth */}
      <div
        className={`p-5 rounded-xl shadow-sm border ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3 className="font-semibold">📈 User Growth</h3>
        <p
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
        >
          Platform growth over time
        </p>
        <div className="mt-10 h-52 rounded-lg flex items-center justify-center">
          <UserGrowthChart />
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
