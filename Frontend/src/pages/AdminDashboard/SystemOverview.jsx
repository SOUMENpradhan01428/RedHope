import React, { useState, useEffect } from "react";
import DonationTrendsChart from "../../components/Admin/DonationTrendsChart";
import UserGrowthChart from "../../components/Admin/UserGrowthChart";
import DistributionPieChart from "../../components/Admin/DistributionPieChart";
import { useTheme } from "../../context/ThemeContext";
import { adminAPI } from "../../services/api";
import { TrendingUp, Users, Droplets, Loader2 } from "lucide-react";

const SystemOverview = () => {
  const { darkMode } = useTheme();
  const [trends, setTrends] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getDonationTrends().then(setTrends).catch(() => {}),
      adminAPI.getUserGrowth().then(setGrowth).catch(() => {}),
      adminAPI.getBloodDistribution().then(setDistribution).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const cardClass = `p-6 rounded-2xl shadow-sm border transition-all ${
    darkMode
      ? "bg-slate-900/60 border-slate-700/50"
      : "bg-white border-gray-100 hover:shadow-md"
  }`;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className={`ml-3 text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>Loading overview...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-lg ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
              <TrendingUp size={18} className="text-blue-500" />
            </div>
            <h3 className="font-semibold">Donation Trends</h3>
          </div>
          <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>Monthly donations vs requests</p>
          <DonationTrendsChart data={trends} />
        </div>
        <div className={cardClass}>
          <div className="flex items-center gap-2 mb-1">
            <div className={`p-1.5 rounded-lg ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
              <Users size={18} className="text-green-500" />
            </div>
            <h3 className="font-semibold">User Growth</h3>
          </div>
          <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>Platform growth over time</p>
          <UserGrowthChart data={growth} />
        </div>
      </div>
      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-1">
          <div className={`p-1.5 rounded-lg ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
            <Droplets size={18} className="text-rose-500" />
          </div>
          <h3 className={`font-semibold ${darkMode ? "text-white" : "text-gray-800"}`}>Blood Type Distribution</h3>
        </div>
        <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>Current stock by blood type</p>
        <div className="max-w-lg mx-auto">
          <DistributionPieChart data={distribution} />
        </div>
      </div>
    </div>
  );
};

export default SystemOverview;
