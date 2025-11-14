

import React, { useState } from "react";
import Navbar from "../components/Navbar";
import UrgentBloodRequests from "../components/Donor/UrgentBloodRequests";
import DonationProgress from "../components/Donor/DonationProgress";
import BloodRequestsNearYou from "../components/Donor/BloodRequestsNearYou";
import DonationCamps from "../components/Donor/DonationCamps";
import RewardSection from "../components/Donor/RewardSection";
import { useTheme } from "../context/ThemeContext"; // ✅ import

const DonorDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const { darkMode } = useTheme(); // ✅ use global theme

  const tabs = ["Overview", "Blood Requests", "Donation Camps", "Rewards"];

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <Navbar />

      <div className="px-6 py-4">
        <h1 className="text-xl font-semibold">Donor Dashboard</h1>
        <p
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
        >
          Welcome back, soumen pradhan! Ready to save lives?
        </p>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {[
            {
              title: "Total Donations",
              value: 8,
              subtitle: "+2 from last month",
              icon: "❤️",
            },
            {
              title: "Points Earned",
              value: 1250,
              subtitle: "Level 4 Donor",
              icon: "⭐",
            },
            {
              title: "Next Donation Available",
              value: "11",
              subtitle: "days until next donation",
              icon: "🕒",
            },
            {
              title: "Lives Saved",
              value: 24,
              subtitle: "Estimated impact",
              icon: "💚",
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

        {/* Tabs */}
        <div
          className={`flex border-b mt-6 space-x-2 ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
                activeTab === tab
                  ? darkMode
                    ? "bg-gray-800 border border-b-0 border-gray-700"
                    : "bg-white border border-b-0 border-gray-200"
                  : darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="mt-4">
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <UrgentBloodRequests />
              <DonationProgress />
            </div>
          )}
          {activeTab === "Blood Requests" && <BloodRequestsNearYou />}
          {activeTab === "Donation Camps" && <DonationCamps />}
          {activeTab === "Rewards" && <RewardSection />}
        </div>
      </div>
    </div>
  );
};

export default DonorDashboard;
