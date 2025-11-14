

import React from "react";
import { useTheme } from "../../context/ThemeContext";

const RewardSection: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div className="space-y-6">
      {/* Rewards Header */}
      <div
        className={`p-6 rounded-xl border shadow-sm ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <h2 className="text-lg font-semibold flex items-center gap-2">
          🏅 Rewards & Achievements
        </h2>
        <p
          className={`${darkMode ? "text-gray-400" : "text-gray-500"} text-sm`}
        >
          Track your donation journey and earn rewards
        </p>

        {/* Summary Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-4">
          {[
            { label: "Current Level", value: "Level 5" },
            { label: "Total Points", value: "1250" },
            { label: "Points to Next Level", value: "250" },
          ].map((item, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg text-center border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-100"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                {item.label}
              </p>
              <h3 className="text-xl font-semibold">{item.value}</h3>
            </div>
          ))}
        </div>

        {/* Progress Bar */}
        <div className="mt-4">
          <p
            className={`text-sm mb-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            Progress to Level 6
          </p>
          <div
            className={`w-full h-2 rounded-full ${
              darkMode ? "bg-gray-700" : "bg-gray-200"
            }`}
          >
            <div className="bg-red-500 h-2 rounded-full w-[83%]"></div>
          </div>
          <p
            className={`text-xs mt-1 ${
              darkMode ? "text-gray-400" : "text-gray-500"
            }`}
          >
            1250 / 1500
          </p>
        </div>
      </div>

      {/* Achievements Section */}
      <div
        className={`p-6 rounded-xl border shadow-sm ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          🎖️ Achievements
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          {/* Earned Achievement */}
          {[
            {
              title: "First Drop",
              text: "Made your first blood donation",
              pts: "+100 points",
            },
            {
              title: "Regular Donor",
              text: "Donated blood 5 times",
              pts: "+250 points",
            },
          ].map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-green-900 border-green-700 text-green-200"
                  : "bg-green-50 border-green-100 text-gray-800"
              }`}
            >
              <h4 className="font-semibold flex justify-between">
                <span>{a.title}</span>
                <span className="text-xs bg-green-500 text-white px-2 py-0.5 rounded-full">
                  Earned
                </span>
              </h4>
              <p className="text-sm">{a.text}</p>
              <p className="text-xs opacity-80 mt-1">{a.pts}</p>
            </div>
          ))}

          {/* Locked Achievements */}
          {[
            { title: "Hero Donor", progress: "80% (+500 pts)" },
            { title: "RedHope", progress: "32% (+1000 pts)" },
          ].map((a, i) => (
            <div
              key={i}
              className={`p-4 rounded-lg border ${
                darkMode
                  ? "bg-gray-700 border-gray-600 text-gray-300"
                  : "bg-gray-50 border-gray-200 text-gray-800"
              }`}
            >
              <h4 className="font-semibold flex justify-between">
                <span>{a.title}</span>
                <span className="text-xs text-gray-400">Locked</span>
              </h4>
              <div
                className={`w-full h-2 rounded-full mt-2 ${
                  darkMode ? "bg-gray-600" : "bg-gray-200"
                }`}
              >
                <div className="bg-green-500 h-2 rounded-full w-[80%]"></div>
              </div>
              <p className="text-xs opacity-70 mt-1">{a.progress}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Available Rewards */}
      <div
        className={`p-6 rounded-xl border shadow-sm ${
          darkMode
            ? "bg-gray-800 border-gray-700 text-gray-100"
            : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <h3 className="text-lg font-semibold flex items-center gap-2">
          🎁 Available Rewards
        </h3>

        <div className="grid sm:grid-cols-2 gap-4 mt-3">
          {[
            {
              title: "☕ Coffee Shop Voucher",
              btn: "Redeem (200 pts)",
              locked: false,
            },
            {
              title: "🎬 Movie Ticket",
              btn: "Redeem (500 pts)",
              locked: false,
            },
            {
              title: "🩺 Health Checkup",
              btn: "Locked (1000 pts)",
              locked: true,
            },
            {
              title: "💆 Wellness Package",
              btn: "Locked (1500 pts)",
              locked: true,
            },
          ].map((r, i) => (
            <div
              key={i}
              className={`p-4 border rounded-lg ${
                r.locked
                  ? darkMode
                    ? "bg-gray-700 opacity-70 border-gray-600"
                    : "bg-gray-100 opacity-70 border-gray-200"
                  : darkMode
                  ? "bg-gray-700 border-gray-600"
                  : "bg-gray-50 border-gray-200"
              }`}
            >
              <h4 className="font-semibold">{r.title}</h4>
              <p className="text-sm opacity-80 mb-2">
                {i === 0 && "$5 voucher for local coffee shop"}
                {i === 1 && "Free movie ticket at participating theaters"}
                {i === 2 && "Free comprehensive health checkup"}
                {i === 3 && "Spa + health package for top donors"}
              </p>

              <button
                className={`px-4 py-1 rounded-md text-sm ${
                  r.locked
                    ? "border border-gray-400 text-gray-500 cursor-not-allowed"
                    : "bg-red-500 hover:bg-red-600 text-white"
                }`}
              >
                {r.btn}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RewardSection;
