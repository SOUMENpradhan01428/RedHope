import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { donorAPI } from "../../services/api";

const Leaderboard = () => {
  const { darkMode } = useTheme();
  const [data, setData] = useState(null);

  useEffect(() => {
    donorAPI.getLeaderboard().then(setData).catch(console.error);
  }, []);

  if (!data) return null;

  const { leaderboard, currentUserRank } = data;

  const getBadgeStyle = (level) => {
    switch (level) {
      case "Platinum": return "bg-gradient-to-r from-gray-200 to-gray-400 text-gray-800 border-gray-400";
      case "Gold": return "bg-gradient-to-r from-yellow-200 to-yellow-500 text-yellow-900 border-yellow-500";
      case "Silver": return "bg-gradient-to-r from-slate-200 to-slate-400 text-slate-800 border-slate-400";
      default: return "bg-gradient-to-r from-orange-200 to-orange-400 text-orange-900 border-orange-400"; // Bronze
    }
  };

  return (
    <div className={`mt-8 p-6 rounded-2xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700" : "bg-white border-slate-200"}`}>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">🏆 City Heroes Leaderboard</h2>
          <p className={`text-sm mt-1 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Top donors making a difference</p>
        </div>
        <div className={`px-4 py-2 rounded-xl text-center ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}>
          <p className="text-xs uppercase tracking-wider font-semibold opacity-70">Your Rank</p>
          <p className="text-xl font-bold">#{currentUserRank}</p>
        </div>
      </div>

      <div className="space-y-3">
        {leaderboard.map((user) => (
          <div 
            key={user._id} 
            className={`flex items-center justify-between p-4 rounded-xl border transition-all ${
              user.rank <= 3 
                ? darkMode ? "bg-red-900/20 border-red-500/30" : "bg-red-50 border-red-200" 
                : darkMode ? "bg-slate-700/50 border-slate-600" : "bg-white border-slate-100"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`w-10 h-10 flex items-center justify-center rounded-full font-bold text-lg ${
                user.rank === 1 ? "bg-yellow-400 text-yellow-900" :
                user.rank === 2 ? "bg-slate-300 text-slate-800" :
                user.rank === 3 ? "bg-orange-300 text-orange-900" :
                darkMode ? "bg-slate-600 text-white" : "bg-slate-200 text-slate-700"
              }`}>
                {user.rank}
              </div>
              <div>
                <h4 className="font-semibold">{user.name}</h4>
                <div className="flex items-center gap-2 mt-1">
                  <span className={`text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded-full border ${getBadgeStyle(user.level)}`}>
                    {user.level}
                  </span>
                  {user.badgeCount > 0 && (
                    <span className="text-xs flex items-center gap-1 opacity-70">
                      🎖️ {user.badgeCount} Badges
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-bold text-lg">{user.totalPoints}</p>
              <p className="text-xs opacity-70">pts</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;
