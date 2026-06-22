import React, { useState } from "react";
import { useTheme } from "../../context/ThemeContext";
import { adminAPI } from "../../services/api";

const Reports = () => {
  const { darkMode } = useTheme();
  const [activeReport, setActiveReport] = useState(null);
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(false);

  const reports = [
    { key: "donations", label: "Donation Report", icon: "🩸", desc: "Total donations, blood type breakdown, hospital-wise data" },
    { key: "users", label: "User Activity Report", icon: "👥", desc: "User stats, top donors, recent signups" },
    { key: "hospitals", label: "Hospital Report", icon: "🏥", desc: "Hospital stock levels, request counts, critical alerts" },
    { key: "bloodTypes", label: "Blood Type Report", icon: "💉", desc: "Stock vs demand per blood type across all hospitals" },
    { key: "regional", label: "Regional Report", icon: "🌍", desc: "Donor/hospital distribution and donations by region" },
  ];

  const fetchReport = async (key) => {
    setLoading(true);
    setActiveReport(key);
    setReportData(null);
    try {
      const fetchers = {
        donations: () => adminAPI.getDonationReport(),
        users: () => adminAPI.getUserActivityReport(),
        hospitals: () => adminAPI.getHospitalReport(),
        bloodTypes: () => adminAPI.getBloodTypeReport(),
        regional: () => adminAPI.getRegionalReport(),
      };
      const data = await fetchers[key]();
      setReportData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const cardClass = `p-4 rounded-xl border shadow-sm ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`;

  return (
    <div className="space-y-6">
      <div className={cardClass}>
        <h3 className="font-semibold mb-2">📄 System Reports</h3>
        <p className={`text-sm mb-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
          Generate detailed reports from real system data
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {reports.map((r) => (
            <button
              key={r.key}
              onClick={() => fetchReport(r.key)}
              className={`p-4 rounded-lg border text-left transition ${
                activeReport === r.key
                  ? "border-blue-500 bg-blue-50 ring-1 ring-blue-300"
                  : darkMode
                  ? "bg-gray-700 hover:bg-gray-600 border-gray-600"
                  : "bg-white hover:bg-gray-50 border-gray-200"
              }`}
            >
              <span className="text-2xl">{r.icon}</span>
              <h4 className="font-semibold mt-1">{r.label}</h4>
              <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{r.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {loading && <p className="text-center py-8 text-gray-500">Loading report...</p>}

      {/* Donation Report */}
      {activeReport === "donations" && reportData && (
        <div className={cardClass}>
          <h3 className="font-semibold mb-3">🩸 Donation Report</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Stat label="Total Donations" value={reportData.totalDonations} />
            <Stat label="Total Units" value={reportData.totalUnits} />
            <Stat label="Blood Types" value={Object.keys(reportData.byBloodType).length} />
            <Stat label="Hospitals" value={Object.keys(reportData.byHospital).length} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">By Blood Type</h4>
              {Object.entries(reportData.byBloodType).map(([type, units]) => (
                <div key={type} className="flex justify-between text-sm py-1 border-b border-gray-100">
                  <span className="bg-red-100 text-red-600 px-2 rounded-full text-xs">{type}</span>
                  <span>{units} units</span>
                </div>
              ))}
            </div>
            <div>
              <h4 className="font-medium mb-2">By Hospital</h4>
              {Object.entries(reportData.byHospital).map(([name, units]) => (
                <div key={name} className="flex justify-between text-sm py-1 border-b border-gray-100">
                  <span>{name}</span>
                  <span>{units} units</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* User Activity Report */}
      {activeReport === "users" && reportData && (
        <div className={cardClass}>
          <h3 className="font-semibold mb-3">👥 User Activity Report</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
            <Stat label="Total Users" value={reportData.totalUsers} />
            <Stat label="Active" value={reportData.activeUsers} />
            <Stat label="Inactive" value={reportData.inactiveUsers} />
            <Stat label="Donors" value={reportData.byRole.Donor} />
          </div>
          <h4 className="font-medium mt-4 mb-2">🏆 Top Donors</h4>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left p-2">#</th>
                  <th className="text-left p-2">Name</th>
                  <th className="text-left p-2">Blood Type</th>
                  <th className="text-left p-2">Donations</th>
                  <th className="text-left p-2">Points</th>
                  <th className="text-left p-2">Level</th>
                </tr>
              </thead>
              <tbody>
                {reportData.topDonors.map((d, i) => (
                  <tr key={i} className={`border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                    <td className="p-2">{i + 1}</td>
                    <td className="p-2 font-medium">{d.name}</td>
                    <td className="p-2"><span className="bg-red-100 text-red-600 px-2 rounded-full text-xs">{d.bloodType}</span></td>
                    <td className="p-2">{d.totalDonations}</td>
                    <td className="p-2">{d.totalPoints}</td>
                    <td className="p-2">Level {d.level}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Hospital Report */}
      {activeReport === "hospitals" && reportData && (
        <div className={cardClass}>
          <h3 className="font-semibold mb-3">🏥 Hospital Report</h3>
          <div className="space-y-4">
            {reportData.map((h) => (
              <div key={h._id} className={`p-4 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold">{h.name}</h4>
                    <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{h.city} • {h.region}</p>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded-full ${h.status === "Active" ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                    {h.status}
                  </span>
                </div>
                <div className="grid grid-cols-4 gap-2 mt-3 text-sm">
                  <div><p className="text-gray-500">Stock</p><p className="font-semibold">{h.totalStock}</p></div>
                  <div><p className="text-gray-500">Critical</p><p className="font-semibold text-red-500">{h.criticalCount}</p></div>
                  <div><p className="text-gray-500">Open Requests</p><p className="font-semibold">{h.openRequests}</p></div>
                  <div><p className="text-gray-500">Donations</p><p className="font-semibold">{h.totalDonations}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Blood Type Report */}
      {activeReport === "bloodTypes" && reportData && (
        <div className={cardClass}>
          <h3 className="font-semibold mb-3">💉 Blood Type Report</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className={`border-b ${darkMode ? "border-gray-700" : "border-gray-200"}`}>
                  <th className="text-left p-2">Blood Type</th>
                  <th className="text-left p-2">Current Stock</th>
                  <th className="text-left p-2">Avg/Hospital</th>
                  <th className="text-left p-2">Total Donated</th>
                  <th className="text-left p-2">Total Requested</th>
                  <th className="text-left p-2">Balance</th>
                </tr>
              </thead>
              <tbody>
                {reportData.map((r) => (
                  <tr key={r.bloodType} className={`border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                    <td className="p-2"><span className="bg-red-100 text-red-600 px-2 rounded-full text-xs font-semibold">{r.bloodType}</span></td>
                    <td className="p-2">{r.currentStock}</td>
                    <td className="p-2">{r.avgPerHospital}</td>
                    <td className="p-2 text-green-600">{r.totalDonated}</td>
                    <td className="p-2 text-red-600">{r.totalRequested}</td>
                    <td className={`p-2 font-semibold ${r.totalDonated - r.totalRequested >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {r.totalDonated - r.totalRequested >= 0 ? "+" : ""}{r.totalDonated - r.totalRequested}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Regional Report */}
      {activeReport === "regional" && reportData && (
        <div className={cardClass}>
          <h3 className="font-semibold mb-3">🌍 Regional Report</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {reportData.map((r) => (
              <div key={r.region} className={`p-4 rounded-lg border ${darkMode ? "bg-gray-700 border-gray-600" : "bg-gray-50 border-gray-200"}`}>
                <h4 className="font-semibold text-lg">{r.region}</h4>
                <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                  <div><p className="text-gray-500">Donors</p><p className="font-semibold">{r.donors}</p></div>
                  <div><p className="text-gray-500">Hospitals</p><p className="font-semibold">{r.hospitals}</p></div>
                  <div><p className="text-gray-500">Donations</p><p className="font-semibold">{r.totalDonations}</p></div>
                  <div><p className="text-gray-500">Units</p><p className="font-semibold">{r.totalUnits}</p></div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

const Stat = ({ label, value }) => {
  const { darkMode } = useTheme();
  return (
    <div className={`p-3 rounded-lg text-center ${darkMode ? "bg-gray-700" : "bg-gray-50"}`}>
      <p className="text-xl font-bold">{value}</p>
      <p className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{label}</p>
    </div>
  );
};

export default Reports;
