import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";

const CampApprovals = () => {
  const { darkMode } = useTheme();
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchApprovals();
  }, []);

  const fetchApprovals = () => {
    setLoading(true);
    adminAPI.getPendingCampApprovals()
      .then(data => {
        // adminAPI sometimes returns full res if it wasn't chained with .then(res=>res.data) 
        // So we handle both arrays and objects
        setApprovals(Array.isArray(data) ? data : (data.data || []));
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleApprove = async (id, status) => {
    try {
      await adminAPI.approveCampRegistration(id, status);
      toast.success(`Registration marked as ${status}!`);
      fetchApprovals();
    } catch (err) {
      toast.error("Error: " + err.message);
    }
  };

  if (loading) {
    return <div className="animate-pulse h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>;
  }

  if (approvals.length === 0) {
    return (
      <div className={`p-8 text-center rounded-xl border ${darkMode ? "bg-slate-800/50 border-slate-700" : "bg-white border-slate-200"}`}>
        <span className="text-4xl block mb-2">✅</span>
        <p className="text-lg font-medium">All caught up!</p>
        <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>There are no pending camp donation approvals.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold mb-4">Pending Camp Donation Approvals</h3>
      {approvals.map((req) => (
        <div key={req._id} className={`p-5 rounded-xl border transition-all ${darkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700/80" : "bg-white border-slate-200 hover:border-indigo-300"}`}>
          <div className="flex flex-col md:flex-row justify-between gap-4">
            
            {/* Donor Details */}
            <div className="flex-1">
              <h4 className="font-semibold text-lg text-indigo-600 dark:text-indigo-400 mb-1">
                {req.donor?.name || "Unknown Donor"}
              </h4>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                <span className="font-medium">Blood Group:</span> <span className="bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 px-2 py-0.5 rounded text-xs">{req.donor?.bloodGroup || "N/A"}</span>
              </p>
              <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                <span className="font-medium">Contact:</span> {req.donor?.phone || "N/A"} ({req.donor?.email})
              </p>
              
              <div className={`mt-3 p-3 rounded-lg text-sm ${darkMode ? "bg-slate-900/50" : "bg-slate-50"}`}>
                <p className="font-semibold mb-1">Camp Visited:</p>
                <p>{req.camp?.name}</p>
                <p className="opacity-80 text-xs mt-1">📅 {req.camp?.date ? new Date(req.camp.date).toLocaleDateString() : ""} 📍 {req.camp?.location}</p>
              </div>
            </div>

            {/* Visit Details */}
            <div className="flex-1 border-l pl-4 dark:border-slate-700 border-slate-200">
              <div className="mb-3">
                <p className="font-semibold text-sm mb-1">Visit Timing:</p>
                <p className={`text-sm ${darkMode ? "text-slate-300" : "text-slate-700"}`}>{req.visitTiming || "Not specified"}</p>
              </div>
              <div className="mb-3">
                <p className="font-semibold text-sm mb-1">Certificate Link:</p>
                {req.certificateUrl ? (
                  <a href={req.certificateUrl} target="_blank" rel="noreferrer" className="text-sm text-blue-500 hover:underline">
                    View Certificate 🔗
                  </a>
                ) : (
                  <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"} italic`}>No certificate uploaded</p>
                )}
              </div>
              <div>
                <p className="font-semibold text-sm mb-1">Feedback:</p>
                <p className={`text-sm italic ${darkMode ? "text-slate-300" : "text-slate-700"}`}>"{req.feedback || "None"}"</p>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 border-l pl-4 dark:border-slate-700 border-slate-200 justify-center min-w-[140px]">
              <button
                onClick={() => handleApprove(req._id, "completed")}
                className="w-full px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all"
              >
                Approve
              </button>
              <button
                onClick={() => handleApprove(req._id, "rejected")}
                className="w-full px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-semibold rounded-lg shadow-md transition-all"
              >
                Reject
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampApprovals;
