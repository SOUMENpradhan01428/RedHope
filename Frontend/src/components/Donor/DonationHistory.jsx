import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { donorAPI } from "../../services/api";

const DonationHistory = () => {
  const { darkMode } = useTheme();
  const [donations, setDonations] = useState([]);
  const [eligibility, setEligibility] = useState(null);

  useEffect(() => {
    donorAPI.getDonations().then(setDonations).catch(console.error);
    donorAPI.checkEligibility().then(setEligibility).catch(console.error);
  }, []);

  return (
    <div className="space-y-4">

      {/* Donation History Table */}
      <div
        className={`p-4 rounded-xl border shadow-sm ${
          darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
        }`}
      >
        <h3 className="font-semibold mb-3">📋 Donation History</h3>
        {donations.length === 0 ? (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            No donations yet. Start saving lives today!
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Hospital</th>
                  <th className="text-left p-2">City</th>
                  <th className="text-left p-2">Blood Type</th>
                  <th className="text-left p-2">Units</th>
                  <th className="text-left p-2">Points</th>
                  <th className="text-left p-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {donations.map((d) => (
                  <tr key={d._id} className={`border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                    <td className="p-2">{new Date(d.donationDate).toLocaleDateString()}</td>
                    <td className="p-2 font-medium">{d.hospital}</td>
                    <td className="p-2">{d.city}</td>
                    <td className="p-2">
                      <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{d.bloodType}</span>
                    </td>
                    <td className="p-2">{d.units}</td>
                    <td className="p-2 text-green-600">+{d.pointsAwarded}</td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-xs ${
                          d.status === "completed"
                            ? "bg-green-100 text-green-600"
                            : d.status === "pending"
                            ? "bg-yellow-100 text-yellow-600"
                            : "bg-red-100 text-red-600"
                        }`}
                      >
                        {d.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default DonationHistory;
