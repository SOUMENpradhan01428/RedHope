import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { donorAPI } from "../../services/api";
import toast from "react-hot-toast";

const RewardSection = () => {
  const { darkMode } = useTheme();
  const [data, setData] = useState(null);

  useEffect(() => {
    donorAPI.getRewards().then(setData).catch(console.error);
  }, []);

  if (!data) return null;

  const { rewards, currentPoints, level, nextLevelPoints, badges } = data;
  const percentage = Math.round((currentPoints / nextLevelPoints) * 100);

  const handleRedeem = async (id) => {
    try {
      const result = await donorAPI.redeemReward(id);
      setData((prev) => ({
        ...prev,
        currentPoints: result.remainingPoints,
        rewards: prev.rewards.map((r) => (r._id === id ? { ...r, isRedeemed: true } : r)),
      }));
      toast.success("Reward redeemed successfully!");
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div
        className={`p-6 rounded-xl border shadow-sm ${
          darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">🏅 Rewards & Achievements</h2>
        <p className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}>
          Track your donation journey and earn rewards
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            { label: "Current Level", value: `Level ${level}` },
            { label: "Total Points", value: currentPoints },
            { label: "Points to Next Level", value: nextLevelPoints - currentPoints },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg text-center border ${
                darkMode ? "bg-gray-700 border-gray-600 text-gray-100" : "bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{item.label}</p>
              <h3 className="text-xl font-semibold">{item.value}</h3>
            </div>
          ))}
        </div>

        <div className="mt-4">
          <p className={`text-sm mb-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            Progress to Level {level + 1}
          </p>
          <div className={`w-full h-2 rounded-full ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
            <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
          </div>
          <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {currentPoints} / {nextLevelPoints}
          </p>
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border shadow-sm ${
          darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">🎖️ Achievements</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          {badges.map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                darkMode ? "bg-green-900 border-green-700 text-green-200" : "bg-green-50 border-green-100 text-gray-800"
              }`}
            >
              <h4 className="font-semibold flex justify-between">
                <span>{a.name}</span>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">Earned</span>
              </h4>
              <p className="text-sm">{a.description}</p>
              <p className="text-xs opacity-80 mt-1">+{a.points} points</p>
            </div>
          ))}
          {badges.length === 0 && (
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No badges earned yet</p>
          )}
        </div>
      </div>

      <div
        className={`p-6 rounded-xl border shadow-sm ${
          darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">🎁 Available Rewards</h3>
        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          {rewards.map((r) => (
            <div
              key={r._id}
              className={`p-4 border rounded-lg ${
                !r.canRedeem
                  ? darkMode ? "bg-gray-700 opacity-70 border-gray-600" : "bg-gray-100 opacity-70 border-gray-200"
                  : darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"
              }`}
            >
              <h4 className="font-semibold">{r.icon} {r.title}</h4>
              <p className="text-sm opacity-80 mb-2">{r.description}</p>
              <button
                onClick={() => r.canRedeem && !r.isRedeemed && handleRedeem(r._id)}
                disabled={!r.canRedeem || r.isRedeemed}
                className={`px-4 py-1 rounded-md text-sm ${
                  r.isRedeemed
                    ? "bg-green-100 text-green-600 border border-green-300"
                    : !r.canRedeem
                    ? "border border-gray-400 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {r.isRedeemed ? "Redeemed" : r.canRedeem ? `Redeem (${r.pointsCost} pts)` : `Locked (${r.pointsCost} pts)`}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardSection;
