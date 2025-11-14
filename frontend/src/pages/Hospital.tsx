
import React from "react";
import Navbar from "../components/Navbar";
import WeeklyCollectionChart from "../components/Charts/WeeklyCollectionChart";
import BloodTypePieChart from "../components/Charts/BloodTypePieChart";
import { AlertCircle } from "lucide-react";
import { useTheme } from "../context/ThemeContext"; // ✅ import

const Hospital: React.FC = () => {
  const { darkMode } = useTheme(); // ✅ get darkMode state

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <Navbar />

      <div className="px-6 py-4">
        <h1 className="text-xl font-semibold">Hospital Dashboard</h1>
        <p
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
        >
          soumen pradhan - Blood Bank Management
        </p>

        {/* Top Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {[
            {
              title: "Current Stock",
              value: 345,
              subtitle: "Total units available",
              icon: "❤️",
            },
            {
              title: "Critical Levels",
              value: 3,
              subtitle: "Blood types below minimum",
              icon: "⚠️",
            },
            {
              title: "Active Requests",
              value: 12,
              subtitle: "Pending blood requests",
              icon: "📅",
            },
            {
              title: "Donors Found",
              value: 45,
              subtitle: "Available in your area",
              icon: "🩸",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl shadow-sm border transition ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h2 className="font-medium">{card.title}</h2>
                <span className="text-xl">{card.icon}</span>
              </div>
              <p className="text-2xl font-semibold mt-2">{card.value}</p>
              <p
                className={`${
                  darkMode ? "text-gray-400" : "text-gray-500"
                } text-sm`}
              >
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-6">
          <div
            className={`p-4 rounded-xl shadow-sm border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="font-semibold mb-3">Weekly Collection</h3>
            <WeeklyCollectionChart />
          </div>
          <div
            className={`p-4 rounded-xl shadow-sm border ${
              darkMode
                ? "bg-gray-800 border-gray-700"
                : "bg-white border-gray-200"
            }`}
          >
            <h3 className="font-semibold mb-3">Blood Type Distribution</h3>
            <BloodTypePieChart />
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div
          className={`p-4 rounded-xl shadow-sm border mt-6 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertCircle className="text-red-500" />
            <h3 className="font-semibold text-red-600">Low Stock Alerts</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
            {[
              { type: "A+", current: 45, min: 50, level: "low" },
              { type: "A-", current: 12, min: 20, level: "critical" },
              { type: "B-", current: 8, min: 15, level: "critical" },
              { type: "AB-", current: 3, min: 10, level: "critical" },
              { type: "O-", current: 18, min: 30, level: "low" },
            ].map((b, i) => (
              <div
                key={i}
                className={`p-3 rounded-lg border transition ${
                  b.level === "critical"
                    ? "border-red-400 bg-red-50 dark:bg-red-900/20"
                    : "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"
                }`}
              >
                <h4 className="font-semibold">{b.type}</h4>
                <p className="text-sm">Current: {b.current}</p>
                <p className="text-xs text-gray-500">Min: {b.min}</p>
                <div className="h-2 mt-1 bg-gray-200 rounded-full">
                  <div
                    className={`h-2 rounded-full ${
                      b.level === "critical" ? "bg-red-500" : "bg-yellow-500"
                    }`}
                    style={{ width: `${(b.current / b.min) * 100}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hospital;
