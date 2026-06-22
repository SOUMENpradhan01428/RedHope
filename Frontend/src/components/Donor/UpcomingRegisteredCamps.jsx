import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { donorAPI } from "../../services/api";

const UpcomingRegisteredCamps = () => {
  const { darkMode } = useTheme();
  const [camp, setCamp] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    donorAPI.getRegisteredCamps()
      .then(data => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const upcoming = data.filter(c => new Date(c.date) >= today);
        // Sort by date ascending to get the closest one
        upcoming.sort((a, b) => new Date(a.date) - new Date(b.date));
        if (upcoming.length > 0) {
          setCamp(upcoming[0]);
        }
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl mt-8"></div>;
  }

  if (!camp) return null;

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const campDate = new Date(camp.date);
  campDate.setHours(0, 0, 0, 0);
  const diffTime = campDate - today;
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  return (
    <div className={`mt-8 p-6 sm:p-8 rounded-3xl shadow-xl bg-gradient-to-br ${darkMode ? "from-red-900/40 to-slate-900 border border-red-500/20" : "from-red-500 to-rose-600 text-white"}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase mb-3 ${darkMode ? "bg-red-500/20 text-red-400" : "bg-white/20 text-white"}`}>
            Your Next Camp
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2">{camp.name}</h2>
          <p className={`text-sm sm:text-base ${darkMode ? "text-slate-300" : "text-white/90"}`}>
            Organized by {camp.organizer}
          </p>
          <div className="mt-4 inline-flex items-center gap-2 bg-black/20 dark:bg-black/40 backdrop-blur-sm px-4 py-2 rounded-xl">
            <span className="text-xl">⏳</span>
            <span className="font-semibold tracking-wide">
              {diffDays === 0 ? "Happening Today!" : `${diffDays} Day${diffDays > 1 ? "s" : ""} Left`}
            </span>
          </div>
        </div>

        <div className={`p-5 rounded-2xl flex-shrink-0 ${darkMode ? "bg-slate-800/80" : "bg-white/10 backdrop-blur-md"}`}>
          <div className="flex items-center gap-3 mb-2">
            <span className="text-2xl">📅</span>
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Date & Time</p>
              <p className="font-semibold">{new Date(camp.date).toLocaleDateString()} at {camp.time}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-2xl">📍</span>
            <div>
              <p className="text-xs opacity-80 uppercase tracking-wide">Location</p>
              <p className="font-semibold">{camp.location}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingRegisteredCamps;
