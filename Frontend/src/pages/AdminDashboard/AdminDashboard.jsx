import React, { useState } from "react";
import Navbar from "../../components/Navbar";
import SystemOverview from "./SystemOverview";
import UserManagement from "./UserManagement";
import Analytics from "./Analytics";
import CampRequest from "../../components/Admin/camprequest";
import { useTheme } from "../../context/ThemeContext";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { darkMode } = useTheme();

  const tabs = [
    { key: "overview", label: "System Overview" },
    { key: "camp", label: "Camp Requests" },
    { key: "users", label: "User Management" },
    { key: "analytics", label: "Analytics" },
  ];

  return (
    <div
      className={`min-h-screen transition-all duration-300 ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"
      }`}
    >
      <Navbar />

      <div className="px-6 py-4">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
          System Administration & Analytics
        </p>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
          {[
            {
              title: "Total Users",
              value: "12,850",
              subtitle: "+12.5% from last month",
              icon: "👥",
            },
            {
              title: "Active Hospitals",
              value: "245",
              subtitle: "+8 new this month",
              icon: "🏥",
            },
            {
              title: "Total Donations",
              value: "34,567",
              subtitle: "+15.2% from last month",
              icon: "❤️",
            },
            {
              title: "System Health",
              value: "98.5%",
              subtitle: "All systems operational",
              icon: "📈",
            },
          ].map((card, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl shadow-sm border ${
                darkMode
                  ? "bg-gray-800 border-gray-700"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between">
                <p className="font-medium">{card.title}</p>
                <span>{card.icon}</span>
              </div>
              <p className="text-2xl font-bold mt-2">{card.value}</p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
                {card.subtitle}
              </p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div
          className={`flex border-b mt-6 space-x-6 text-sm ${
            darkMode ? "border-gray-700" : "border-gray-200"
          }`}
        >
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`pb-2 ${
                activeTab === tab.key
                  ? "border-b-2 border-blue-500 font-semibold text-blue-400"
                  : darkMode
                  ? "text-gray-400 hover:text-gray-200"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="mt-6">
          {activeTab === "overview" && <SystemOverview />}
          {activeTab === "camp" && <CampRequest />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "analytics" && <Analytics />}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;