import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { donorAPI } from "../../services/api";

const DonationProgress = () => {
  const { darkMode } = useTheme();
  const [progress, setProgress] = useState(null);

  useEffect(() => {
    donorAPI.getProgress().then(setProgress).catch(() => {
      setProgress({
        level: 1,
        totalPoints: 0,
        nextThreshold: 100,
        badges: []
      });
    });
  }, []);

  if (!progress) return null;

  const percentage = Math.round((progress.totalPoints / progress.nextThreshold) * 100);

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h3 className="font-semibold mb-1">🏅 Donation Progress</h3>
      <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Your journey to becoming a super donor
      </p>

      <p className="text-sm font-medium mb-1">
        Next Level (Level {progress.level + 1}):{" "}
        <span className={darkMode ? "text-gray-400" : "text-gray-600"}>
          {progress.totalPoints}/{progress.nextThreshold} points
        </span>
      </p>

      <div className={`w-full h-2 rounded-full mb-3 ${darkMode ? "bg-gray-700" : "bg-gray-200"}`}>
        <div className="bg-red-500 h-2 rounded-full" style={{ width: `${Math.min(percentage, 100)}%` }}></div>
      </div>

      <div className="space-y-2">
        {progress.badges.map((badge, i) => (
          <div key={i} className="flex justify-between text-sm">
            <span>{badge.name}</span>
            <span className="text-green-600 border border-green-500 px-2 py-0.5 rounded-full text-xs">Earned</span>
          </div>
        ))}
        {progress.badges.length === 0 && (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Keep donating to earn badges!</p>
        )}
      </div>
    </div>
  );
};

export default DonationProgress;
