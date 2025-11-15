import React from "react";
import { useTheme } from "../../context/ThemeContext";

const CampRequest: React.FC = () => {
  const { darkMode } = useTheme();

  return (
    <div
      className={`p-4 rounded-xl shadow-sm border ${
        darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
      }`}
    >
      <h3 className="font-semibold text-lg mb-4">Camp Request Form</h3>

      <form className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        
        {/* Camp Name */}
        <div>
          <label className="text-sm font-medium">Camp Name</label>
          <input
            type="text"
            placeholder="Enter camp name"
            className={`w-full p-2 rounded-lg border mt-1 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-100 border-gray-300"
            }`}
          />
        </div>

        {/* Organizer Name */}
        <div>
          <label className="text-sm font-medium">Organizer Name</label>
          <input
            type="text"
            placeholder="Enter organizer name"
            className={`w-full p-2 rounded-lg border mt-1 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-100 border-gray-300"
            }`}
          />
        </div>

        {/* Date */}
        <div>
          <label className="text-sm font-medium">Date</label>
          <input
            type="date"
            className={`w-full p-2 rounded-lg border mt-1 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-100 border-gray-300"
            }`}
          />
        </div>

        {/* Time */}
        <div>
          <label className="text-sm font-medium">Time</label>
          <input
            type="time"
            className={`w-full p-2 rounded-lg border mt-1 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-100 border-gray-300"
            }`}
          />
        </div>

        {/* Full Location */}
        <div className="sm:col-span-2">
          <label className="text-sm font-medium">Full Location</label>
          <textarea
            placeholder="Enter full address/location"
            rows={3}
            className={`w-full p-2 rounded-lg border mt-1 ${
              darkMode
                ? "bg-gray-700 border-gray-600 text-white"
                : "bg-gray-100 border-gray-300"
            }`}
          ></textarea>
        </div>
      </form>
      <button className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-800 transition">
Submit Request
</button>
    </div>
  );
};

export default CampRequest;
