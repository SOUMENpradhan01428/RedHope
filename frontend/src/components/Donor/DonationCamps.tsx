

import React from "react";
import { useTheme } from "../../context/ThemeContext";

const DonationCamps: React.FC = () => {
  const { darkMode } = useTheme();

  const camps = [
    {
      name: "Community Center Blood Drive",
      org: "Red Cross",
      date: "2024-01-20",
      time: "09:00 - 17:00",
      location: "Community Center, Main St (1.2 km)",
      attendees: 45,
      slots: 55,
      desc: "Join us for our monthly community blood drive. Light refreshments provided.",
    },
    {
      name: "University Campus Drive",
      org: "Student Health Services",
      date: "2024-01-22",
      time: "10:00 - 16:00",
      location: "University Campus, Student Union (3.8 km)",
      attendees: 78,
      slots: 72,
      desc: "Help save lives while supporting your local university community.",
    },
    {
      name: "Corporate Wellness Drive",
      org: "TechCorp",
      date: "2024-01-25",
      time: "11:00 - 15:00",
      location: "TechCorp Building, Business District (5.2 km)",
      attendees: 23,
      slots: 52,
      desc: "Corporate-sponsored blood drive with health screenings.",
    },
  ];

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        darkMode
          ? "bg-gray-800 border-gray-700 text-gray-100"
          : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h3 className="font-semibold mb-1">🩸 Upcoming Blood Donation Camps</h3>
      <p
        className={`text-sm mb-3 ${
          darkMode ? "text-gray-400" : "text-gray-500"
        }`}
      >
        Join community blood drives in your area
      </p>

      <div className="space-y-3">
        {camps.map((c, i) => (
          <div
            key={i}
            className={`p-4 rounded-lg transition ${
              darkMode
                ? "bg-gray-700 hover:bg-gray-600"
                : "bg-gray-50 hover:bg-gray-100"
            }`}
          >
            <h4 className="font-semibold">{c.name}</h4>
            <p className="text-sm text-gray-500 mb-1">Organized by {c.org}</p>
            <p className="text-sm mb-1">
              📅 {c.date} | 🕒 {c.time} | 📍 {c.location}
            </p>
            <p className="text-sm mb-2">{c.desc}</p>
            <div className="flex justify-between items-center text-sm">
              <span className="text-green-600 border border-green-500 px-2 py-0.5 rounded-full">
                {c.attendees} attendees
              </span>
              <span className="text-gray-400">{c.slots} slots available</span>
              <div className="flex gap-2">
                <button
                  className={`border px-3 py-1 rounded-md ${
                    darkMode
                      ? "border-gray-600 text-gray-300 hover:bg-gray-700"
                      : "border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  RSVP
                </button>
                <button
                  className={`border px-3 py-1 rounded-md ${
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

export default DonationCamps;
