import React from "react";
import { useTheme } from "../../context/ThemeContext";

const UrgentBloodRequests = () => {
  const { darkMode } = useTheme();

  const requests = [
    {
      level: "critical",
      hospital: "General Hospital",
      type: "O+",
      distance: 2.3,
      match: "100%",
    },
    {
      level: "high",
      hospital: "City Medical Center",
      type: "O-",
      distance: 4.1,
      match: "85%",
    },
    {
      level: "medium",
      hospital: "Emergency Care",
      type: "A+",
      distance: 3.7,
      match: "70%",
    },
  ];

  const getColor = (level) =>
    ({
      critical: darkMode
        ? "bg-red-900 text-red-300"
        : "bg-red-100 text-red-600",
      high: darkMode
        ? "bg-orange-900 text-orange-300"
        : "bg-orange-100 text-orange-600",
      medium: darkMode
        ? "bg-yellow-900 text-yellow-300"
        : "bg-yellow-100 text-yellow-600",
    }[level] || "");

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h3 className="font-semibold mb-1">❤️ Urgent Blood Requests</h3>
      <p
        className={`text-sm mb-3 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Blood requests matching your type and location
      </p>

      <div className="space-y-3">
        {requests.map((r, i) => (
          <div
            key={i}
            className={`flex justify-between items-center p-3 rounded-lg transition ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div>
              <span
                className={`text-xs px-2 py-1 rounded-full ${getColor(
                  r.level
                )}`}
              >
                {r.level}
              </span>
              <h4 className="font-semibold mt-1">{r.hospital}</h4>
              <p
                className={`text-sm ${
                  darkMode ? "text-gray-300" : "text-gray-500"
                }`}
              >
                {r.type} • {r.distance} km • {r.match} match
              </p>
            </div>

            <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
              Respond
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UrgentBloodRequests;