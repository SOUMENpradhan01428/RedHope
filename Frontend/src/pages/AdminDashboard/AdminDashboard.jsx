import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import SystemOverview from "./SystemOverview";
import UserManagement from "./UserManagement";
import Analytics from "./Analytics";
import CampRequest from "../../components/Admin/camprequest";
import Reports from "./Reports";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { adminAPI } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Building2, HeartPulse, ShieldCheck, Download } from "lucide-react";
import WelcomeOverlay from "../../components/WelcomeOverlay";
import HospitalApprovals from "../../components/Admin/HospitalApprovals";
import CampApprovals from "../../components/Admin/CampApprovals";
import ManageRewards from "../../components/Admin/ManageRewards";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    adminAPI.getDashboard().then(setStats).catch(() => {
      setStats({
        totalUsers: 0,
        activeHospitals: 0,
        totalDonations: 0,
        systemHealth: 100
      });
    });
  }, []);

  const exportSystemReport = () => {
    // Generate a simple CSV report of system stats
    if (!stats) return;
    const csvContent = "data:text/csv;charset=utf-8,"
      + "Metric,Value\n"
      + `Total Users,${stats.totalUsers}\n`
      + `Active Hospitals,${stats.activeHospitals}\n`
      + `Total Donations,${stats.totalDonations}\n`
      + `System Health,${stats.systemHealth}%\n`;
    
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "admin_system_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const tabs = [
    { key: "overview", label: "System Overview" },
    { key: "approvals", label: "Hospital Approvals" },
    { key: "campApprovals", label: "Donation Approvals" },
    { key: "camp", label: "Camp Management" },
    { key: "users", label: "User Management" },
    { key: "rewards", label: "Rewards" },
    { key: "analytics", label: "Analytics" },
    { key: "reports", label: "Reports" },
  ];

  const cards = stats
    ? [
        { title: "Total Users", value: stats.totalUsers.toLocaleString(), subtitle: "All registered users", icon: <Users size={24} className="text-blue-500" /> },
        { title: "Active Hospitals", value: stats.activeHospitals, subtitle: "Currently active", icon: <Building2 size={24} className="text-purple-500" /> },
        { title: "Total Donations", value: stats.totalDonations.toLocaleString(), subtitle: "Completed donations", icon: <HeartPulse size={24} className="text-rose-500" /> },
        { title: "System Health", value: `${stats.systemHealth}%`, subtitle: "All systems operational", icon: <ShieldCheck size={24} className="text-emerald-500" /> },
      ]
    : [];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  const cardClass = `p-6 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${darkMode ? "bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/80" : "bg-white/70 border-white hover:bg-white"}`;

  return (
    <div className={`min-h-screen transition-all duration-500 ${darkMode ? "bg-slate-950 text-white" : "bg-slate-50 text-slate-800"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
              Admin Portal
            </h1>
            <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} text-base mt-1`}>
              Centralized System Administration & Analytics
            </p>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            onClick={exportSystemReport}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:-translate-y-0.5 transition-all text-sm font-semibold"
          >
            <Download size={18} /> Export Report
          </motion.button>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
        >
          {cards.map((card, i) => (
            <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }} key={i} className={cardClass}>
              <div className="flex justify-between items-start">
                <p className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{card.title}</p>
                <div className={`p-2.5 rounded-xl ${darkMode ? "bg-slate-800/80" : "bg-slate-100"}`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-4xl font-bold mt-4">{card.value}</p>
              <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} text-sm mt-2 font-medium`}>{card.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className={`flex overflow-x-auto no-scrollbar border-b mt-10 space-x-2 ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`relative px-6 py-3 text-sm font-semibold rounded-t-xl transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? darkMode
                    ? "bg-slate-800/80 text-white"
                    : "bg-white text-indigo-600 shadow-sm"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  : "text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div 
                  layoutId="adminTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-indigo-600 dark:bg-indigo-400"
                />
              )}
            </button>
          ))}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-8"
        >
          {activeTab === "overview" && <SystemOverview />}
          {activeTab === "approvals" && <HospitalApprovals />}
          {activeTab === "campApprovals" && <CampApprovals />}
          {activeTab === "camp" && <CampRequest />}
          {activeTab === "users" && <UserManagement />}
          {activeTab === "rewards" && <ManageRewards />}
          {activeTab === "analytics" && <Analytics />}
          {activeTab === "reports" && <Reports />}
        </motion.div>
      </div>
    </div>
  );
};

export default AdminDashboard;
