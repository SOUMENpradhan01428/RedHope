import React, { useState, useEffect } from "react";
import DonationTrendsChart from "../../components/Admin/DonationTrendsChart";
import UserGrowthChart from "../../components/Admin/UserGrowthChart";
import DistributionPieChart from "../../components/Admin/DistributionPieChart";
import ActivityBarChart from "../../components/Admin/ActivityBarChart";
import RegionalChart from "../../components/Admin/RegionalChart";
import { useTheme } from "../../context/ThemeContext";
import { adminAPI } from "../../services/api";
import { TrendingUp, Users, Droplets, Clock, MapPin, Loader2 } from "lucide-react";

const Analytics = () => {
  const { darkMode } = useTheme();
  const [trends, setTrends] = useState([]);
  const [growth, setGrowth] = useState([]);
  const [distribution, setDistribution] = useState([]);
  const [peakHours, setPeakHours] = useState([]);
  const [regional, setRegional] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      adminAPI.getDonationTrends().then(setTrends).catch(() => {}),
      adminAPI.getUserGrowth().then(setGrowth).catch(() => {}),
      adminAPI.getBloodDistribution().then(setDistribution).catch(() => {}),
      adminAPI.getPeakHours().then(setPeakHours).catch(() => {}),
      adminAPI.getRegionalActivity().then(setRegional).catch(() => {}),
    ]).finally(() => setLoading(false));
  }, []);

  const cardClass = `p-6 rounded-2xl shadow-sm border transition-all ${
    darkMode
      ? "bg-slate-900/60 border-slate-700/50 hover:border-slate-600"
      : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-md"
  }`;

  const sections = [
    {
      title: "Donation Trends",
      subtitle: "Monthly donations vs requests (last 6 months)",
      icon: <TrendingUp size={18} className="text-blue-500" />,
      component: <DonationTrendsChart data={trends} />,
    },
    {
      title: "User Growth",
      subtitle: "Platform growth & new user signups",
      icon: <Users size={18} className="text-green-500" />,
      component: <UserGrowthChart data={growth} />,
    },
    {
      title: "Blood Type Distribution",
      subtitle: "Current stock across all blood types",
      icon: <Droplets size={18} className="text-rose-500" />,
      component: <DistributionPieChart data={distribution} />,
      tall: true,
    },
    {
      title: "Peak Activity Hours",
      subtitle: "Request volume by time of day",
      icon: <Clock size={18} className="text-cyan-500" />,
      component: <ActivityBarChart data={peakHours} />,
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="animate-spin text-blue-500" size={32} />
        <span className={`ml-3 text-sm ${darkMode ? "text-slate-400" : "text-gray-500"}`}>Loading analytics...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className={`grid grid-cols-1 lg:grid-cols-2 gap-6 ${darkMode ? "text-white" : "text-gray-800"}`}>
        {sections.map((item, i) => (
          <div key={i} className={cardClass}>
            <div className="flex items-center gap-2 mb-1">
              <div className={`p-1.5 rounded-lg ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
                {item.icon}
              </div>
              <h3 className="font-semibold text-base">{item.title}</h3>
            </div>
            <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>{item.subtitle}</p>
            <div className={item.tall ? "" : ""}>{item.component}</div>
          </div>
        ))}
      </div>

      <div className={cardClass}>
        <div className="flex items-center gap-2 mb-1">
          <div className={`p-1.5 rounded-lg ${darkMode ? "bg-slate-800" : "bg-gray-50"}`}>
            <MapPin size={18} className="text-purple-500" />
          </div>
          <h3 className={`font-semibold text-base ${darkMode ? "text-white" : "text-gray-800"}`}>Regional Activity</h3>
        </div>
        <p className={`text-xs mb-4 ${darkMode ? "text-slate-400" : "text-gray-500"}`}>User distribution across regions</p>
        <RegionalChart data={regional} />
      </div>
    </div>
  );
};

export default Analytics;
