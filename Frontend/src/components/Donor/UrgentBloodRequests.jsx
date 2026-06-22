import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { donorAPI } from "../../services/api";
import toast from "react-hot-toast";

const UrgentBloodRequests = () => {
  const { darkMode } = useTheme();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    donorAPI.getUrgentRequests().then(setRequests).catch(() => {
      setRequests([]);
    });
  }, []);

  const getColor = (level) =>
    ({
      critical: darkMode ? "bg-red-900 text-red-300" : "bg-red-100 text-red-600",
      high: darkMode ? "bg-orange-900 text-orange-300" : "bg-orange-100 text-orange-600",
      medium: darkMode ? "bg-yellow-900 text-yellow-300" : "bg-yellow-100 text-yellow-600",
    }[level] || "");

  const handleRespond = async (id) => {
    try {
      await donorAPI.respondToRequest(id);
      toast.success("Successfully responded to blood request!");
      setRequests((prev) => prev.map((r) => r._id === id ? { ...r, hasResponded: true } : r));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h3 className="font-semibold mb-1">❤️ Urgent Blood Requests</h3>
      <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Blood requests matching your type and location
      </p>

      <div className="space-y-3">
        {requests.slice(0, 5).map((r) => (
          <div
            key={r._id}
            className={`flex justify-between items-center p-3 rounded-lg transition ${
              darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <div>
              <span className={`text-xs px-2 py-1 rounded-full ${getColor(r.urgency)}`}>{r.urgency}</span>
              <h4 className="font-semibold mt-1">{r.hospital}</h4>
              <p className={`text-sm ${darkMode ? "text-gray-300" : "text-gray-500"}`}>
                {r.bloodType} • {r.distance} km • {r.match} match
              </p>
            </div>
            <button
              onClick={() => handleRespond(r._id)}
              disabled={r.hasResponded}
              className={`${r.hasResponded ? "bg-gray-400 cursor-not-allowed dark:bg-gray-600" : "bg-red-500 hover:bg-red-600"} text-white px-3 py-1 rounded-md transition-colors`}
            >
              {r.hasResponded ? "Responded" : "Respond"}
            </button>
          </div>
        ))}
        {requests.length === 0 && (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No urgent requests right now</p>
        )}
      </div>
    </div>
  );
};

export default UrgentBloodRequests;
