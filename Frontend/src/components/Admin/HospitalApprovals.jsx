import React, { useState, useEffect } from "react";
import { adminAPI } from "../../services/api";
import { Check, X, Building2, FileText, Mail, MapPin } from "lucide-react";
import toast from "react-hot-toast";
import { useTheme } from "../../context/ThemeContext";

const HospitalApprovals = () => {
  const { darkMode } = useTheme();
  const [hospitals, setHospitals] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHospitals();
  }, []);

  const fetchHospitals = async () => {
    setLoading(true);
    try {
      const data = await adminAPI.getPendingHospitals();
      setHospitals(data);
    } catch (error) {
      console.error(error);
      setHospitals([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      await adminAPI.updateHospitalStatus(id, status);
      toast.success(`Hospital ${status.toLowerCase()} successfully`);
      fetchHospitals(); // Refresh the list
    } catch (error) {
      toast.error("Failed to update status");
      console.error(error);
    }
  };

  if (loading) return <div className="text-center py-10">Loading pending requests...</div>;

  return (
    <div className={`rounded-3xl p-6 sm:p-8 border shadow-2xl transition-colors duration-500 ${darkMode ? "bg-slate-900/60 border-slate-800/50 shadow-rose-900/5" : "bg-white/70 backdrop-blur-xl border-slate-200"}`}>
      <div className={`flex items-center gap-4 mb-8 pb-6 border-b ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-rose-500 shadow-sm ${darkMode ? "bg-rose-900/30" : "bg-rose-100"}`}>
          <Building2 size={24} />
        </div>
        <div>
          <h2 className={`text-xl font-bold ${darkMode ? "text-white" : "text-slate-800"}`}>Hospital Approvals</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Review and approve new hospital registrations</p>
        </div>
      </div>

      {hospitals.length === 0 ? (
        <div className={`text-center py-12 px-4 rounded-2xl border ${darkMode ? "bg-slate-800/50 border-slate-700/50" : "bg-slate-50 border-slate-100"}`}>
          <Check size={48} className="mx-auto text-emerald-400 mb-4 opacity-50" />
          <h3 className={`text-lg font-semibold ${darkMode ? "text-slate-300" : "text-slate-700"}`}>All Caught Up!</h3>
          <p className={`${darkMode ? "text-slate-400" : "text-slate-500"}`}>There are no pending hospital registrations to review.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {hospitals.map((hospital) => (
            <div key={hospital._id} className={`group relative overflow-hidden rounded-2xl p-6 border hover:shadow-xl transition-all duration-300 ${darkMode ? "bg-slate-800 border-slate-700 hover:shadow-rose-500/10" : "bg-white border-slate-200 hover:border-indigo-300"}`}>
              <div className="flex justify-between items-start mb-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center ${darkMode ? "bg-slate-700 text-slate-400" : "bg-slate-100 text-slate-500"}`}>
                  <Building2 size={20} />
                </div>
                <span className={`px-3 py-1 text-xs font-semibold rounded-full border ${darkMode ? "bg-amber-500/10 text-amber-500 border-amber-500/20" : "bg-amber-100 text-amber-600 border-amber-200"}`}>
                  Pending Review
                </span>
              </div>
              
              <h3 className={`text-lg font-bold mb-1 ${darkMode ? "text-white" : "text-slate-800"}`}>{hospital.hospitalName || hospital.name}</h3>
              
              <div className={`space-y-3 mt-4 mb-6 text-sm ${darkMode ? "text-slate-400" : "text-slate-600"}`}>
                <div className="flex items-center">
                  <Mail size={16} className="mr-2 opacity-70" />
                  {hospital.email}
                </div>
                <div className="flex items-center">
                  <FileText size={16} className="mr-2 opacity-70" />
                  License: {hospital.licenseNumber || "N/A"}
                </div>
                <div className="flex items-center">
                  <MapPin size={16} className="mr-2 opacity-70" />
                  Registered: {new Date(hospital.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => handleAction(hospital._id, "Approved")}
                  className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-colors"
                >
                  <Check size={18} />
                  Approve
                </button>
                <button
                  onClick={() => handleAction(hospital._id, "Rejected")}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-medium transition-colors ${darkMode ? "bg-slate-700 hover:bg-rose-900/30 text-slate-300 hover:text-rose-500" : "bg-slate-100 hover:bg-rose-50 text-slate-700 hover:text-rose-600"}`}
                >
                  <X size={18} />
                  Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default HospitalApprovals;
