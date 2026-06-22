import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import UrgentBloodRequests from "../../components/Donor/UrgentBloodRequests";
import DonationProgress from "../../components/Donor/DonationProgress";
import BloodRequestsNearYou from "../../components/Donor/BloodRequestsNearYou";
import DonationCamps from "../../components/Donor/DonationCamps";
import RewardSection from "../../components/Donor/RewardSection";
import DonationHistory from "../../components/Donor/DonationHistory";
import UpcomingRegisteredCamps from "../../components/Donor/UpcomingRegisteredCamps";
import Leaderboard from "../../components/Donor/Leaderboard";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { donorAPI } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeOverlay from "../../components/WelcomeOverlay";
import { HeartPulse, Star, Clock, ShieldCheck } from "lucide-react";

const DonorDashboard = () => {
  const [activeTab, setActiveTab] = useState("Overview");
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    donorAPI.getDashboard().then(setStats).catch(() => {
      setStats({
        totalDonations: 0,
        level: "Bronze",
        pointsEarned: 0,
        daysUntilNextDonation: 0,
        livesSaved: 0
      });
    });
    if (donorAPI.checkEligibility) {
      donorAPI.checkEligibility().then(setEligibility).catch(console.error);
    }
  }, []);

  const tabs = ["Overview", "Blood Requests", "Donation History", "Donation Camps", "Rewards"];

  const cards = stats
    ? [
        { title: "Total Donations", value: stats.totalDonations, subtitle: `Level ${stats.level} Donor`, icon: <HeartPulse size={24} className="text-rose-500" /> },
        { title: "Points Earned", value: stats.pointsEarned, subtitle: `Level ${stats.level} Donor`, icon: <Star size={24} className="text-yellow-500" /> },
        { title: "Next Donation Available", value: stats.daysUntilNextDonation, subtitle: "days until next donation", icon: <Clock size={24} className="text-blue-500" /> },
        { title: "Lives Saved", value: stats.livesSaved, subtitle: "Estimated impact", icon: <ShieldCheck size={24} className="text-emerald-500" /> },
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

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-slate-950 text-white" : "bg-rose-50 text-slate-900"}`}>
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
            Donor Dashboard
          </h1>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} text-base mt-1`}>
            Welcome back, <span className="font-semibold">{user?.name || "Donor"}</span>! Ready to save lives?
          </p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
        >
          {cards.map((card, i) => (
            <motion.div
              variants={cardVariants}
              whileHover={{ y: -5, scale: 1.02 }}
              key={i}
              className={`p-6 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${
                darkMode ? "bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/80" : "bg-white/70 border-white hover:bg-white"
              }`}
            >
              <div className="flex justify-between items-start">
                <h2 className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{card.title}</h2>
                <div className={`p-2.5 rounded-xl ${darkMode ? "bg-slate-800/80" : "bg-slate-100"}`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-4xl font-bold mt-4">{card.value}</p>
              <p className={`mt-2 text-sm font-medium ${darkMode ? "text-red-400" : "text-red-500"}`}>{card.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>

        {eligibility && !eligibility.isEligibleNow && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mt-8 mb-4 p-6 sm:p-8 rounded-3xl shadow-xl bg-gradient-to-br flex flex-col md:flex-row items-start gap-4 ${
              darkMode 
                ? "from-red-900/40 to-slate-900 border border-red-500/20" 
                : "from-red-500 to-rose-600 text-white"
            }`}
          >
            <span className="text-3xl sm:text-4xl">⏳</span>
            <div>
              <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 ${darkMode ? "bg-red-500/20 text-red-400" : "bg-white/20 text-white"}`}>
                Donation Cooldown Active
              </span>
              <p className={`text-sm sm:text-base mb-1 ${darkMode ? "text-slate-300" : "text-white/90"}`}>
                You donated blood <strong className="font-bold"> {eligibility.daysSinceLastDonation} days ago</strong>. For your safety, there is a mandatory 56-day waiting period between donations.
              </p>
              <p className={`text-sm sm:text-base font-semibold ${darkMode ? "text-slate-300" : "text-white"}`}>
                You will be eligible to donate again in {eligibility.daysUntilEligible} days (on {new Date(eligibility.nextEligibleDate).toLocaleDateString()}).
              </p>
              <p className={`text-xs mt-2 italic ${darkMode ? "text-slate-400" : "text-white/70"}`}>
                Note: You can still register for upcoming camps that are scheduled on or after your next eligible date.
              </p>
            </div>
          </motion.div>
        )}

        <UpcomingRegisteredCamps />

        <div className={`flex overflow-x-auto no-scrollbar border-b mt-10 space-x-2 ${darkMode ? "border-slate-800" : "border-rose-200"}`}>
          {tabs.map((tab) => (
            <button
              key={tab}
              className={`relative px-6 py-3 text-sm font-medium rounded-t-xl transition-all whitespace-nowrap ${
                activeTab === tab
                  ? darkMode
                    ? "bg-slate-800/80 text-white"
                    : "bg-white text-rose-600 shadow-sm"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  : "text-slate-500 hover:text-rose-600 hover:bg-rose-100/50"
              }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
              {activeTab === tab && (
                <motion.div 
                  layoutId="activeTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
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
          className="mt-6"
        >
          {activeTab === "Overview" && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <UrgentBloodRequests />
              <DonationProgress />
            </div>
          )}
          {activeTab === "Blood Requests" && <BloodRequestsNearYou />}
          {activeTab === "Donation History" && <DonationHistory />}
          {activeTab === "Donation Camps" && <DonationCamps />}
          {activeTab === "Rewards" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-8">
              <RewardSection />
              <Leaderboard />
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default DonorDashboard;
