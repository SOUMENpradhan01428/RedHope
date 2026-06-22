import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import WeeklyCollectionChart from "../../components/Charts/WeeklyCollectionChart";
import BloodTypePieChart from "../../components/Charts/BloodTypePieChart";
import { AlertCircle, Activity, Heart, Droplets, Clock, CheckCircle, Download, XCircle, Plus } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { hospitalAPI } from "../../services/api";
import { motion, AnimatePresence } from "framer-motion";
import WelcomeOverlay from "../../components/WelcomeOverlay";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";
import MapPicker from "../../components/MapPicker";

const Hospital = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("overview");
  const [stats, setStats] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [weeklyData, setWeeklyData] = useState([]);
  const [pieData, setPieData] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [requests, setRequests] = useState([]);
  const [form, setForm] = useState({ 
    hospitalName: "", bloodType: "A+", units: "", urgency: "critical", details: "", 
    location: { address: "", lat: 20.5937, lng: 78.9629 } 
  });
  const [submitting, setSubmitting] = useState(false);
  const [stockEdit, setStockEdit] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });

  const refresh = () => {
    hospitalAPI.getDashboard().then(setStats).catch(() => {
      setStats({ currentStock: 0, criticalLevels: 0, activeRequests: 0, donorsFound: 0 });
    });
    hospitalAPI.getLowStockAlerts().then(setAlerts).catch(() => {
      setAlerts([]);
    });
    hospitalAPI.getWeeklyCollection().then(setWeeklyData).catch(() => {});
    hospitalAPI.getBloodTypeDistribution().then(setPieData).catch(() => {});
    hospitalAPI.getBloodStock().then(setStocks).catch(() => {
      setStocks([]);
    });
    hospitalAPI.getMyRequests().then((res) => {
      console.log("getMyRequests response:", res);
      setRequests(res);
    }).catch((err) => {
      console.error("getMyRequests error:", err);
      toast.error("Failed to fetch my requests: " + err.message);
      setRequests([]);
    });
  };

  useEffect(refresh, []);

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await hospitalAPI.createBloodRequest({ ...form, units: Number(form.units) });
      setForm({ 
        hospitalName: "", bloodType: "A+", units: "", urgency: "critical", details: "", 
        location: { address: "", lat: 20.5937, lng: 78.9629 } 
      });
      toast.success("Blood request broadcasted successfully!");
      refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleSearchAddress = async () => {
    if (!form.location.address) {
      toast.error("Please enter an address to search");
      return;
    }
    try {
      toast.loading("Searching location...", { id: "search" });
      const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(form.location.address)}&countrycodes=in`);
      const data = await response.json();
      if (data && data.length > 0) {
        const firstResult = data[0];
        setForm({
          ...form,
          location: {
            ...form.location,
            lat: parseFloat(firstResult.lat),
            lng: parseFloat(firstResult.lon),
            address: firstResult.display_name // Update with the formal address
          }
        });
        toast.success("Location found!", { id: "search" });
      } else {
        toast.error("Location not found on map", { id: "search" });
      }
    } catch (err) {
      toast.error("Failed to search location", { id: "search" });
    }
  };

  const handleUpdateStock = async (bloodType, currentUnits, minimumUnits) => {
    try {
      await hospitalAPI.updateBloodStock({ bloodType, currentUnits: Number(currentUnits), minimumUnits: Number(minimumUnits) });
      setStockEdit(null);
      toast.success("Blood stock updated!");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleRequestStatus = async (id, status) => {
    try {
      await hospitalAPI.updateRequestStatus(id, status);
      toast.success(`Request marked as ${status}!`);
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleConfirmDonation = async (requestId, donorId, bloodType) => {
    try {
      await hospitalAPI.confirmDonation({ requestId, donorId, bloodType, units: 1 });
      toast.success("Donation confirmed! Donor has been rewarded.");
      refresh();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const exportData = () => {
    const csvContent = "Blood Type,Current Units,Minimum Units\n"
      + stocks.map(e => `${e.bloodType},${e.currentUnits},${e.minimumUnits}`).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "blood_stock_report.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const tabs = [
    { key: "overview", label: "Overview" },
    { key: "requests", label: `My Requests (${requests.length})` },
    { key: "stock", label: "Blood Stock" },
    { key: "newRequest", label: "+ New Request" },
  ];

  const cards = stats
    ? [
        { title: "Current Stock", value: stats.currentStock, subtitle: "Total units available", icon: <Droplets className="text-red-500" size={24} /> },
        { title: "Critical Levels", value: stats.criticalLevels, subtitle: "Blood types below minimum", icon: <AlertCircle className="text-orange-500" size={24} /> },
        { title: "Active Requests", value: stats.activeRequests, subtitle: "Pending blood requests", icon: <Activity className="text-blue-500" size={24} /> },
        { title: "Fulfilled Requests", value: stats.fulfilledRequests || 0, subtitle: "Completed requests", icon: <CheckCircle className="text-green-500" size={24} /> },
      ]
    : [];

  const inputClass = `w-full p-3 mt-1 rounded-xl outline-none transition-all duration-300 ${darkMode ? "bg-slate-800/50 border border-slate-700 focus:bg-slate-800 focus:border-red-500/50 text-white" : "bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-300 focus:shadow-md"}`;
  const cardClass = `p-6 rounded-2xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${darkMode ? "bg-slate-900/60 border-slate-700/50 hover:bg-slate-800/80" : "bg-white/70 border-white hover:bg-white"}`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-slate-950 text-white" : "bg-rose-50 text-slate-900"}`}>
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, data: null })}
        onConfirm={() => {
          if (confirmState.data) {
            handleConfirmDonation(confirmState.data.requestId, confirmState.data.donorId, confirmState.data.bloodType);
          }
        }}
        title="Confirm Donation"
        message={`Are you sure you want to confirm the donation from ${confirmState.data?.donorName}? This will award them gamification points.`}
        confirmText="Confirm Donation"
      />
      <WelcomeOverlay role="Hospital" userName={user?.name || "Hospital"} />
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600">
              Hospital Dashboard
            </h1>
            <p className={`${darkMode ? "text-slate-400" : "text-slate-500"} text-base mt-1`}>
              <span className="font-semibold">{user?.name || "Hospital"}</span> - Blood Bank Management
            </p>
          </motion.div>
          <motion.button 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
            onClick={exportData}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl shadow transition-all text-sm font-medium ${darkMode ? "bg-slate-800 text-white hover:bg-slate-700 border border-slate-700" : "bg-white text-rose-600 hover:bg-rose-50 border border-rose-200"}`}
          >
            <Download size={16} /> Export Data
          </motion.button>
        </div>

        {/* Stat Cards */}
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-8"
        >
          {cards.map((card, i) => (
            <motion.div variants={cardVariants} whileHover={{ y: -5, scale: 1.02 }} key={i} className={cardClass}>
              <div className="flex justify-between items-start">
                <h2 className={`font-medium ${darkMode ? "text-slate-300" : "text-slate-600"}`}>{card.title}</h2>
                <div className={`p-2 rounded-xl ${darkMode ? "bg-slate-800/50" : "bg-red-50"}`}>
                  {card.icon}
                </div>
              </div>
              <p className="text-4xl font-bold mt-4">{card.value}</p>
              <p className={`mt-2 text-sm font-medium ${darkMode ? "text-red-400" : "text-red-500"}`}>{card.subtitle}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Tabs */}
        <div className={`flex overflow-x-auto no-scrollbar border-b mt-10 space-x-2 ${darkMode ? "border-slate-800" : "border-rose-200"}`}>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              className={`relative px-6 py-3 text-sm font-medium rounded-t-xl transition-all whitespace-nowrap ${
                activeTab === tab.key
                  ? darkMode
                    ? "bg-slate-800/80 text-white"
                    : "bg-white text-rose-600 shadow-sm"
                  : darkMode
                  ? "text-slate-400 hover:text-slate-200 hover:bg-slate-800/30"
                  : "text-slate-500 hover:text-rose-600 hover:bg-rose-100/50"
              }`}
              onClick={() => setActiveTab(tab.key)}
            >
              {tab.label}
              {activeTab === tab.key && (
                <motion.div 
                  layoutId="hospitalTabIndicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 bg-red-500"
                />
              )}
            </button>
          ))}
        </div>

        <motion.div 
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="mt-6"
        >
          {/* OVERVIEW TAB */}
          {activeTab === "overview" && (
            <>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className={cardClass}>
                  <h3 className="font-semibold mb-3">Weekly Collection</h3>
                  <WeeklyCollectionChart data={weeklyData} />
                </div>
                <div className={cardClass}>
                  <h3 className="font-semibold mb-3">Blood Type Distribution</h3>
                  <BloodTypePieChart data={pieData} />
                </div>
              </div>

              {/* Low Stock Alerts */}
              <div className={`${cardClass} mt-6`}>
                <div className="flex items-center gap-2 mb-3">
                  <AlertCircle className="text-red-500" /><h3 className="font-semibold text-red-600">Low Stock Alerts</h3>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  {alerts.map((b, i) => (
                    <div key={i} className={`p-4 rounded-xl border ${b.level === "critical" ? "border-red-400 bg-red-50 dark:bg-red-900/20" : "border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20"}`}>
                      <h4 className="font-semibold">{b.bloodType}</h4>
                      <div className="mt-2 flex justify-between text-sm">
                        <span>Current: <span className="font-bold">{b.current}</span></span>
                        <span className="text-gray-500">Min: {b.min}</span>
                      </div>
                      <div className="h-2 mt-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${b.level === "critical" ? "bg-red-500" : "bg-yellow-500"}`} style={{ width: `${Math.min((b.current / b.min) * 100, 100)}%` }}></div>
                      </div>
                    </div>
                  ))}
                  {alerts.length === 0 && (
                    <div className="col-span-full py-4 text-center border border-dashed rounded-xl border-green-300 bg-green-50/50 dark:border-green-800 dark:bg-green-900/10 text-green-600 dark:text-green-400 flex flex-col items-center justify-center gap-2">
                      <CheckCircle size={24} />
                      <p className="text-sm font-medium">All blood types are at healthy levels!</p>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* MY REQUESTS TAB */}
          {activeTab === "requests" && (
            <div className="space-y-4">
              {requests.length === 0 ? (
                <div className={`${cardClass} text-center py-10`}><p className="text-gray-500">No blood requests yet.</p></div>
              ) : (
                requests.map((r) => (
                  <motion.div layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} key={r._id} className={cardClass}>
                    <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-md flex items-center gap-1 ${
                            r.urgency === "critical" ? "bg-red-100 text-red-700" :
                            r.urgency === "high" ? "bg-orange-100 text-orange-700" :
                            r.urgency === "medium" ? "bg-yellow-100 text-yellow-700" : "bg-blue-100 text-blue-700"
                          }`}>
                            <Activity size={12} /> {r.urgency.toUpperCase()}
                          </span>
                          <span className="bg-rose-100 text-rose-700 font-bold px-2.5 py-1 rounded-md text-xs">{r.bloodType}</span>
                          <span className="text-sm font-medium">{r.units} units needed</span>
                        </div>
                        <p className="text-sm mt-3 text-gray-600 dark:text-gray-300">{r.details}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2 flex items-center gap-1">
                          <Clock size={12} /> {new Date(r.createdAt).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <span className={`px-3 py-1 text-xs font-semibold rounded-md border ${
                          r.status === "open" ? "bg-green-50 border-green-200 text-green-700" :
                          r.status === "fulfilled" ? "bg-blue-50 border-blue-200 text-blue-700" : "bg-gray-50 border-gray-200 text-gray-700"
                        }`}>{r.status.toUpperCase()}</span>
                        {r.status === "open" && (
                          <>
                            <button onClick={() => handleRequestStatus(r._id, "fulfilled")} className="text-xs font-medium bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded-md transition-colors flex items-center gap-1">
                              <CheckCircle size={14} /> Mark Fulfilled
                            </button>
                            <button onClick={() => handleRequestStatus(r._id, "cancelled")} className="text-xs font-medium bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded-md transition-colors flex items-center gap-1">
                              <XCircle size={14} /> Cancel
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    {/* Responded Donors */}
                    {r.respondedBy && r.respondedBy.length > 0 && (
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <h4 className="text-sm font-semibold mb-3">Responded Donors ({r.respondedBy.length})</h4>
                        <div className="space-y-2">
                          {r.respondedBy.map((donor) => (
                            <div key={donor._id} className={`flex flex-col sm:flex-row justify-between sm:items-center p-3 rounded-xl border ${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-gray-50 border-gray-200"}`}>
                              <div className="text-sm mb-2 sm:mb-0">
                                <span className="font-semibold">{donor.name}</span>
                                <span className="ml-2 bg-rose-100 text-rose-700 font-bold px-2 py-0.5 rounded text-xs">{donor.bloodType || r.bloodType}</span>
                                {donor.phone && <span className="ml-3 text-gray-500">📞 {donor.phone}</span>}
                              </div>
                              {r.status === "open" && (
                                <button
                                  onClick={() => {
                                    const actualDonorId = typeof donor.donorId === 'object' && donor.donorId !== null ? donor.donorId._id : donor.donorId;
                                    setConfirmState({
                                      isOpen: true,
                                      data: { requestId: r._id, donorId: actualDonorId, donorName: donor.name, bloodType: donor.bloodType || r.bloodType }
                                    });
                                  }}
                                  className="text-xs font-medium bg-green-500 hover:bg-green-600 text-white px-3 py-1.5 rounded-md transition-colors w-full sm:w-auto"
                                >
                                  Confirm Donation
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </motion.div>
                ))
              )}
            </div>
          )}

          {/* BLOOD STOCK TAB */}
          {activeTab === "stock" && (
            <div className={cardClass}>
              <div className="flex items-center gap-2 mb-6">
                <Droplets className="text-red-500" />
                <h3 className="font-semibold text-lg">Blood Stock Management</h3>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {stocks.map((s) => {
                  const isEditing = stockEdit === s.bloodType;
                  const isCritical = s.currentUnits < s.minimumUnits;
                  return (
                    <motion.div layout key={s.bloodType} className={`p-5 rounded-2xl border transition-all ${isCritical ? "border-red-400 bg-red-50/50 dark:bg-red-900/10 shadow-red-100" : darkMode ? "bg-gray-800/40 border-gray-700" : "bg-gray-50/50 border-gray-200"}`}>
                      <div className="flex justify-between items-center mb-2">
                        <h4 className={`text-2xl font-extrabold ${darkMode ? "text-white" : "text-gray-800"}`}>{s.bloodType}</h4>
                        <button onClick={() => setStockEdit(isEditing ? null : s.bloodType)} className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30 px-2 py-1 rounded">
                          {isEditing ? "Cancel" : "Edit"}
                        </button>
                      </div>
                      {isEditing ? (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 space-y-3">
                          <div>
                            <label className="text-xs font-medium text-gray-500">Current Units</label>
                            <input type="number" defaultValue={s.currentUnits} id={`stock-${s.bloodType}`} className={inputClass} />
                          </div>
                          <div>
                            <label className="text-xs font-medium text-gray-500">Minimum Required</label>
                            <input type="number" defaultValue={s.minimumUnits} id={`min-${s.bloodType}`} className={inputClass} />
                          </div>
                          <button
                            onClick={() => {
                              const cur = document.getElementById(`stock-${s.bloodType}`).value;
                              const min = document.getElementById(`min-${s.bloodType}`).value;
                              handleUpdateStock(s.bloodType, cur, min);
                            }}
                            className="w-full py-2 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg text-sm font-semibold shadow-sm hover:shadow-md transition-all"
                          >
                            Save Changes
                          </button>
                        </motion.div>
                      ) : (
                        <>
                          <div className="flex items-end gap-2 mt-2">
                            <p className="text-4xl font-bold">{s.currentUnits}</p>
                            <p className="text-sm text-gray-500 mb-1">units</p>
                          </div>
                          <p className="text-xs text-gray-400 mt-1 font-medium">Target Min: {s.minimumUnits}</p>
                          <div className="h-2.5 mt-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full ${isCritical ? "bg-red-500" : "bg-emerald-500"}`} style={{ width: `${Math.min((s.currentUnits / Math.max(s.minimumUnits, 1)) * 100, 100)}%` }}></div>
                          </div>
                          {isCritical && <p className="text-xs text-red-500 mt-2 font-bold flex items-center gap-1"><AlertCircle size={12}/> Critical Alert</p>}
                        </>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          )}

          {/* NEW REQUEST TAB */}
          {activeTab === "newRequest" && (
            <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className={cardClass}>
              <div className="flex items-center gap-2 mb-6">
                <Plus className="text-rose-500" />
                <h3 className="font-semibold text-lg">Create New Blood Request</h3>
              </div>
              <form onSubmit={handleSubmitRequest} className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium ml-1 text-gray-600 dark:text-gray-300">Hospital Name</label>
                  <input type="text" value={form.hospitalName} onChange={(e) => setForm({ ...form, hospitalName: e.target.value })} placeholder="Enter hospital name" className={inputClass} />
                </div>
                <div>
                  <label className="text-sm font-medium ml-1 text-gray-600 dark:text-gray-300">Urgency Level</label>
                  <select value={form.urgency} onChange={(e) => setForm({ ...form, urgency: e.target.value })} className={inputClass}>
                    <option value="critical">Critical (Immediate)</option>
                    <option value="high">High (Within 24hrs)</option>
                    <option value="medium">Medium (Within 2-3 days)</option>
                    <option value="low">Low (Routine)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium ml-1 text-gray-600 dark:text-gray-300">Blood Type</label>
                  <select value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })} className={inputClass}>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => <option key={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-medium ml-1 text-gray-600 dark:text-gray-300">Required Units</label>
                  <input type="number" value={form.units} onChange={(e) => setForm({ ...form, units: e.target.value })} placeholder="Enter units (e.g., 5)" required min="1" className={inputClass} />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium ml-1 text-gray-600 dark:text-gray-300">Details / Reason</label>
                  <input type="text" value={form.details} onChange={(e) => setForm({ ...form, details: e.target.value })} placeholder="e.g., Emergency trauma surgery, Rare blood type shortage" className={inputClass} />
                </div>
                
                {/* Location Section */}
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium ml-1 text-gray-600 dark:text-gray-300">Hospital Address</label>
                  <div className="flex gap-2 items-center mt-1">
                    <input 
                      type="text" 
                      value={form.location.address} 
                      onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })} 
                      placeholder="e.g., 123 Health Ave, New York" 
                      required
                      className={`flex-1 p-3 rounded-xl outline-none transition-all duration-300 ${darkMode ? "bg-slate-800/50 border border-slate-700 focus:bg-slate-800 focus:border-red-500/50 text-white" : "bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-300 focus:shadow-md"}`}
                    />
                    <button 
                      type="button" 
                      onClick={handleSearchAddress}
                      className="px-4 py-3 bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-xl text-sm font-semibold transition-colors whitespace-nowrap shadow-sm"
                    >
                      Search Map
                    </button>
                  </div>
                </div>
                <div className="sm:col-span-2 relative z-0">
                  <label className="text-sm font-medium ml-1 text-gray-600 dark:text-gray-300 mb-1 block">Pin Exact Location on Map</label>
                  <p className="text-xs text-gray-500 mb-2 ml-1">Click anywhere on the map to place the hospital's pin</p>
                  <MapPicker 
                    location={form.location} 
                    setLocation={(loc) => setForm({ ...form, location: loc })} 
                  />
                </div>

                <motion.button 
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit" 
                  disabled={submitting} 
                  className="sm:col-span-2 w-full px-8 py-3.5 bg-gradient-to-r from-red-500 to-rose-600 text-white font-semibold rounded-xl hover:from-red-600 hover:to-rose-700 disabled:opacity-50 transition-all shadow-lg shadow-red-500/30 mt-2"
                >
                  {submitting ? "Submitting Request..." : "Broadcast Blood Request"}
                </motion.button>
              </form>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Hospital;
