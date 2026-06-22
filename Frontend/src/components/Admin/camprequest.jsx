import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../ConfirmModal";

const CampRequest = () => {
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState("manage"); // "manage" or "create"
  
  // Form State
  const [form, setForm] = useState({ name: "", organizer: "", date: "", startTime: "", endTime: "", location: "", description: "", totalSlots: 50 });
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState("");
  const [editCampId, setEditCampId] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });

  // Camps List State
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchCamps = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getCamps();
      setCamps(Array.isArray(data) ? data : data.camps || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === "manage") {
      fetchCamps();
    }
  }, [activeTab]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setSuccess("");
    try {
      const submitData = {
        ...form,
        time: `${form.startTime}-${form.endTime}`
      };
      delete submitData.startTime;
      delete submitData.endTime;

      if (editCampId) {
        await adminAPI.updateCamp(editCampId, submitData);
        setSuccess("Camp updated successfully!");
      } else {
        await adminAPI.createCamp(submitData);
        setSuccess("Camp created successfully!");
      }
      setForm({ name: "", organizer: "", date: "", startTime: "", endTime: "", location: "", description: "", totalSlots: 50 });
      setEditCampId(null);
      setTimeout(() => setActiveTab("manage"), 1500); // Switch to manage view automatically
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (camp) => {
    const timeParts = camp.time ? camp.time.split("-").map(t => t.trim()) : ["", ""];
    setForm({
      name: camp.name,
      organizer: camp.organizer,
      date: new Date(camp.date).toISOString().split('T')[0],
      startTime: timeParts[0] || "",
      endTime: timeParts[1] || "",
      location: camp.location,
      description: camp.description || "",
      totalSlots: camp.totalSlots
    });
    setEditCampId(camp._id);
    setActiveTab("create");
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteCamp(id);
      toast.success("Camp deleted successfully");
      fetchCamps();
    } catch (err) {
      toast.error(err.message);
    }
  };

  const isCampActive = (campDate) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const cDate = new Date(campDate);
    cDate.setHours(0, 0, 0, 0);
    return cDate >= today;
  };

  return (
    <>
      <ConfirmModal
        isOpen={confirmState.isOpen}
        onClose={() => setConfirmState({ isOpen: false, data: null })}
        onConfirm={() => {
          if (confirmState.data) {
            handleDelete(confirmState.data);
          }
        }}
        title="Delete Camp"
        message="Are you sure you want to delete this camp? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
      <div className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${darkMode ? "bg-slate-900/60 border-slate-700/50 text-slate-100" : "bg-white/70 border-white text-slate-800"}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">🏕️ Camp Management</h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"} mt-1`}>
            Create new blood donation camps and manage existing ones.
          </p>
        </div>

        <div className={`flex rounded-xl p-1.5 border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "manage"
                ? "bg-indigo-600 text-white shadow"
                : darkMode ? "text-slate-300 hover:text-white hover:bg-slate-700" : "text-slate-600 hover:bg-white"
            }`}
            onClick={() => setActiveTab("manage")}
          >
            All Camps
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "create"
                ? "bg-indigo-600 text-white shadow"
                : darkMode ? "text-slate-300 hover:text-white hover:bg-slate-700" : "text-slate-600 hover:bg-white"
            }`}
            onClick={() => {
              setActiveTab("create");
              if (!editCampId) {
                setForm({ name: "", organizer: "", date: "", startTime: "", endTime: "", location: "", description: "", totalSlots: 50 });
              }
            }}
          >
            {editCampId ? "Edit Camp" : "Create New Camp"}
          </button>
        </div>
      </div>

      {activeTab === "create" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {success && <div className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-sm p-3 rounded-lg mb-4 font-medium">{success}</div>}
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="text-sm font-medium mb-1 block">Camp Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Enter camp name"
                required
                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Organizer Name</label>
              <input
                type="text"
                value={form.organizer}
                onChange={(e) => setForm({ ...form, organizer: e.target.value })}
                placeholder="Enter organizer name"
                required
                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
              />
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Date</label>
              <input
                type="date"
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                required
                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
              />
            </div>
            <div className="flex gap-2">
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">Start Time</label>
                <input
                  type="time"
                  value={form.startTime}
                  onChange={(e) => setForm({ ...form, startTime: e.target.value })}
                  required
                  className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
              <div className="flex-1">
                <label className="text-sm font-medium mb-1 block">End Time</label>
                <input
                  type="time"
                  value={form.endTime}
                  onChange={(e) => setForm({ ...form, endTime: e.target.value })}
                  required
                  className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-1 block">Total Slots</label>
              <input
                type="number"
                value={form.totalSlots}
                onChange={(e) => setForm({ ...form, totalSlots: Number(e.target.value) })}
                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
              />
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Full Location</label>
              <textarea
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
                placeholder="Enter full address/location"
                rows={2}
                required
                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
              ></textarea>
            </div>
            <div className="sm:col-span-2">
              <label className="text-sm font-medium mb-1 block">Description</label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="Camp description"
                rows={2}
                className={`w-full p-2.5 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition-all ${darkMode ? "bg-slate-800 border-slate-700 text-white" : "bg-slate-50 border-slate-200"}`}
              ></textarea>
            </div>
            <div className="sm:col-span-2 mt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full sm:w-auto px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl disabled:opacity-50 transition-all shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50"
              >
                {submitting ? (editCampId ? "Updating..." : "Creating...") : (editCampId ? "Update Camp" : "Create Camp")}
              </button>
              {editCampId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditCampId(null);
                    setForm({ name: "", organizer: "", date: "", startTime: "", endTime: "", location: "", description: "", totalSlots: 50 });
                    setActiveTab("manage");
                  }}
                  className={`w-full sm:w-auto px-6 py-2.5 ml-0 sm:ml-3 mt-3 sm:mt-0 font-semibold rounded-xl transition-all ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-200 hover:bg-slate-300 text-slate-800"}`}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {activeTab === "manage" && (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          {loading ? (
            <div className="text-center py-10">Loading camps...</div>
          ) : (
            <div className={`overflow-x-auto rounded-xl border ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
              <table className="w-full text-sm text-left border-collapse">
                <thead>
                  <tr className={`border-b ${darkMode ? "border-slate-700 bg-slate-800/50" : "bg-slate-50 border-slate-200"}`}>
                    <th className="p-4 font-semibold">Camp Name</th>
                    <th className="p-4 font-semibold">Organizer</th>
                    <th className="p-4 font-semibold">Date & Time</th>
                    <th className="p-4 font-semibold">Slots</th>
                    <th className="p-4 font-semibold">Status</th>
                    <th className="p-4 font-semibold text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {camps.length === 0 ? (
                    <tr>
                      <td colSpan="6" className={`p-8 text-center ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                        No camps found. Create one to get started!
                      </td>
                    </tr>
                  ) : (
                    camps.map((camp) => {
                      const active = isCampActive(camp.date);
                      return (
                        <tr key={camp._id} className={`border-b last:border-0 transition-colors ${darkMode ? "border-slate-700/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50/50"}`}>
                          <td className="p-4 font-medium">{camp.name}</td>
                          <td className="p-4 opacity-80">{camp.organizer}</td>
                          <td className="p-4 opacity-80">
                            {new Date(camp.date).toLocaleDateString()} <br/>
                            <span className="text-xs opacity-70">{camp.time}</span>
                          </td>
                          <td className="p-4 opacity-80">{camp.totalSlots}</td>
                          <td className="p-4">
                            <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${
                              active 
                                ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border-emerald-200 dark:border-emerald-500/20" 
                                : "bg-slate-100 text-slate-600 dark:bg-slate-500/20 dark:text-slate-400 border-slate-200 dark:border-slate-500/30"
                            }`}>
                              {active ? "Active" : "Completed"}
                            </span>
                          </td>
                          <td className="p-4 text-center">
                            <button 
                              onClick={() => handleEdit(camp)} 
                              className="px-3 py-1.5 mr-2 rounded-lg text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-500/10 text-xs font-semibold transition-all"
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => setConfirmState({ isOpen: true, data: camp._id })} 
                              className="px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-semibold transition-all"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
    </>
  );
};

export default CampRequest;
