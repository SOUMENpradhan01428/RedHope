

import React from "react";
import { useTheme } from "../../context/ThemeContext";

const BloodRequestsNearYou: React.FC = () => {
  const { darkMode } = useTheme();

  const requests = [
    {
      level: "critical",
      hospital: "General Hospital",
      type: "O+",
      details: "Emergency surgery",
      distance: "2.3 km",
      posted: "2h",
      units: 5,
    },
    {
      level: "high",
      hospital: "City Medical Center",
      type: "A-",
      details: "Cancer treatment",
      distance: "4.1 km",
      posted: "5h",
      units: 3,
    },
    {
      level: "medium",
      hospital: "Children's Hospital",
      type: "B+",
      details: "Pediatric surgery",
      distance: "6.7 km",
      posted: "8h",
      units: 2,
    },
    {
      level: "critical",
      hospital: "Emergency Care Center",
      type: "O-",
      details: "Trauma patient",
      distance: "3.2 km",
      posted: "1h",
      units: 4,
    },
  ];

  const getColor = (level: string) => {
    switch (level) {
      case "critical":
        return "bg-red-100 text-red-600";
      case "high":
        return "bg-orange-100 text-orange-600";
      case "medium":
        return "bg-yellow-100 text-yellow-600";
      default:
        return "";
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h3 className="font-semibold mb-1">📍 Blood Requests Near You</h3>
      <p
        className={`text-sm mb-3 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Find urgent blood requests in your area
      </p>

      <div
        className={`w-full h-40 rounded-lg mb-4 flex items-center justify-center text-sm ${
          darkMode
            ? "bg-gray-700 text-gray-300"
            : "bg-gradient-to-r from-blue-50 to-green-50 text-gray-500"
        }`}
      >
        Interactive Map Showing 4 Requests
      </div>

      <div className="space-y-3">
        {requests.map((r, i) => (
          <div
            key={i}
            className={`p-3 rounded-lg transition ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span
                  className={`text-xs px-2 py-1 rounded-full ${getColor(
                    r.level
                  )}`}
                >
                  {r.level}
                </span>
                <h4 className="font-semibold mt-1">
                  {r.hospital}{" "}
                  <span
                    className={`text-sm ${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    ({r.type})
                  </span>
                </h4>
                <p className="text-sm text-gray-500">{r.details}</p>
                <p
                  className={`text-xs mt-1 ${
                    darkMode ? "text-gray-400" : "text-gray-400"
                  }`}
                >
                  {r.distance} • {r.posted} ago • {r.units} units needed
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md">
                  Respond
                </button>
                <button
                  className={`border text-sm px-3 py-1 rounded-md ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Get Directions
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BloodRequestsNearYou;
