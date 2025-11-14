

import React from "react";
import { useTheme } from "../../context/ThemeContext";

const reports = [
  "Donation Report",
  "User Activity Report",
  "Hospital Report",
  "Regional Report",
  "Blood Type Report",
  "Trends Report",
];

const Reports = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-5 rounded-xl shadow-sm border transition-all duration-300 ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-white"
          : "bg-white text-gray-800"
      }`}
    >
      <h3 className="font-semibold mb-2">📄 System Reports</h3>
      <p
        className={`${
          darkMode ? "text-gray-400" : "text-gray-500"
        } text-sm mb-4`}
      >
        Generate and download system reports
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {reports.map((r, i) => (
          <button
            key={i}
            className={`border p-20 rounded-lg transition-colors ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600 border-gray-600 text-gray-200"
                : "bg-white hover:bg-gray-100 border-gray-200 text-gray-700"
            }`}
          >
            {r}
          </button>
        ))}
      </div>
    </div>
  );
};

export default Reports;
