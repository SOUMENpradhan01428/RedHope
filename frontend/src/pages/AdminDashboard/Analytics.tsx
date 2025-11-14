


import React from "react";
import DonationTrendsChart from "../../components/Admin/DonationTrendsChart";
import UserGrowthChart from "../../components/Admin/UserGrowthChart";
import DistributionPieChart from "../../components/Admin/DistributionPieChart";
import ActivityBarChart from "../../components/Admin/ActivityBarChart";
import RegionalChart from "../../components/Admin/RegionalChart";
import { useTheme } from "../../context/ThemeContext";

const Analytics = () => {
  const { darkMode } = useTheme();

  const sections = [
    { title: "Donation Trends", component: <DonationTrendsChart /> },
    { title: "User Growth", component: <UserGrowthChart /> },
    { title: "Blood Type Distribution", component: <DistributionPieChart /> },
    { title: "Peak Activity Hours", component: <ActivityBarChart /> },
  ];

  return (
    <div
      className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${
        darkMode ? "text-white" : "text-gray-800"
      }`}
    >
      {sections.map((item, i) => (
        <div
          key={i}
          className={`p-5 rounded-xl shadow-sm border transition-all duration-300 ${
            darkMode
              ? "bg-gray-800 border-gray-700"
              : "bg-white border-gray-200"
          }`}
        >
          <h3 className="font-semibold mb-3">{item.title}</h3>
          <div className="h-48 mt-10 mb-10 flex items-center justify-center">
            {item.component}
          </div>
        </div>
      ))}

      <div
        className={`col-span-full p-5 rounded-xl shadow-sm border transition-all duration-300 ${
          darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
        }`}
      >
        <h3 className="font-semibold">Regional Activity</h3>
        <div className="h-56 mt-10 flex items-center justify-center">
          <RegionalChart />
        </div>
      </div>
    </div>
  );
};

export default Analytics;
