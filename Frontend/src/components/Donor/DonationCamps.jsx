import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { donorAPI } from "../../services/api";
import toast from "react-hot-toast";

const DonationCamps = () => {
  const { darkMode } = useTheme();
  const [camps, setCamps] = useState([]);
  const [eligibility, setEligibility] = useState(null);
  
  // Modal State
  const [selectedCampId, setSelectedCampId] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    bloodGroup: "",
    healthDetails: {
      isThalassemic: false,
      hasHepatitis: false,
      hasHighBloodPressure: false,
      hasDiabetes: false,
      hasSTD: false,
      isSmoker: false,
    }
  });

  useEffect(() => {
    donorAPI.getCamps().then(setCamps).catch(console.error);
    if (donorAPI.checkEligibility) {
      donorAPI.checkEligibility().then(setEligibility).catch(console.error);
    }
  }, []);

  const handleApply = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await donorAPI.applyForCamp(selectedCampId, formData);
      setCamps((prev) =>
        prev.map((c) =>
          c._id === selectedCampId ? { ...c, attendeesCount: (c.attendeesCount || 0) + 1, isRegistered: true } : c
        )
      );
      setSelectedCampId(null);
      setFormData({
        name: "",
        phone: "",
        address: "",
        bloodGroup: "",
        healthDetails: {
          isThalassemic: false,
          hasHepatitis: false,
          hasHighBloodPressure: false,
          hasDiabetes: false,
          hasSTD: false,
          isSmoker: false,
        }
      });
      toast.success("Successfully registered for the camp!");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const [activeTab, setActiveTab] = useState("available");
  
  // Check if user has any active registrations (excluding completed/rejected/pending)
  const hasActiveRegistration = camps.some(c => c.isRegistered && (!c.status || c.status === "registered"));

  const availableCamps = camps.filter(c => !c.isRegistered);
  const registeredCamps = camps.filter(c => c.isRegistered && c.status !== "completed" && c.status !== "rejected");

  const displayedCamps = activeTab === "available" ? availableCamps : registeredCamps;

  // Completion Form State
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completionCampId, setCompletionCampId] = useState(null);
  const [completionData, setCompletionData] = useState({
    attended: false,
    visitTiming: "",
    certificateUrl: "",
    feedback: ""
  });

  const handleCompleteClick = (campId) => {
    setCompletionCampId(campId);
    setShowCompletionModal(true);
  };

  const submitCompletion = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await donorAPI.submitCampCompletion(completionCampId, completionData);
      const newStatus = completionData.attended ? "pending_completion" : "rejected";
      setCamps((prev) =>
        prev.map((c) =>
          c._id === completionCampId ? { ...c, status: newStatus } : c
        )
      );
      setShowCompletionModal(false);
      setCompletionCampId(null);
      setCompletionData({ attended: false, visitTiming: "", certificateUrl: "", feedback: "" });
      if (completionData.attended) {
        toast.success("Completion request submitted! Waiting for Admin approval.");
      } else {
        toast.success("Marked as not attended.");
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const isCampPast = (camp) => {
    if (!camp || !camp.date) return false;
    const now = new Date();
    const cDate = new Date(camp.date);
    
    if (camp.time) {
      const timeParts = camp.time.split("-");
      const endTimeStr = (timeParts[1] || timeParts[0]).trim();
      if (endTimeStr) {
        const [hours, minutes] = endTimeStr.split(":");
        if (hours && minutes) {
          cDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
          return now > cDate;
        }
      }
    }
    
    cDate.setHours(23, 59, 59, 999);
    return now > cDate;
  };

  return (
    <div className={`p-4 rounded-xl border shadow-sm ${darkMode ? "bg-slate-800 border-slate-700 text-slate-100" : "bg-white border-slate-200 text-slate-800"}`}>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <h3 className="font-semibold text-lg mb-1">🩸 Blood Donation Camps</h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
            Join community blood drives in your area
          </p>
        </div>
        <div className={`flex rounded-lg p-1 ${darkMode ? "bg-slate-700" : "bg-slate-100"}`}>
          <button
            onClick={() => setActiveTab("available")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "available"
                ? (darkMode ? "bg-slate-600 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm")
                : (darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
            }`}
          >
            Available Camps
          </button>
          <button
            onClick={() => setActiveTab("registered")}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
              activeTab === "registered"
                ? (darkMode ? "bg-slate-600 text-white shadow-sm" : "bg-white text-slate-900 shadow-sm")
                : (darkMode ? "text-slate-400 hover:text-white" : "text-slate-600 hover:text-slate-900")
            }`}
          >
            Registered
          </button>
        </div>
      </div>

      {hasActiveRegistration && activeTab === "available" && (
        <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800/50 rounded-lg text-sm font-medium flex items-center gap-2">
          <span>ℹ️</span> You are already registered for an upcoming camp. You cannot register for another one until it is completed.
        </div>
      )}



      <div className="space-y-4">
        {displayedCamps.map((c) => (
          <div key={c._id} className={`p-5 rounded-xl border transition ${darkMode ? "bg-slate-700/50 border-slate-600 hover:bg-slate-700" : "bg-slate-50 border-slate-100 hover:bg-slate-100"}`}>
            <h4 className="font-semibold text-lg">{c.name}</h4>
            <p className="text-sm text-slate-500 mb-2">Organized by <span className="font-medium text-slate-700 dark:text-slate-300">{c.organizer}</span></p>
            <div className="flex flex-wrap gap-x-4 gap-y-2 mb-3 text-sm font-medium">
              <span className="flex items-center gap-1 text-indigo-600 dark:text-indigo-400">📅 {new Date(c.date).toLocaleDateString()}</span>
              <span className="flex items-center gap-1 text-orange-600 dark:text-orange-400">🕒 {c.time}</span>
              <span className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400">📍 {c.location}</span>
            </div>
            {c.description && <p className="text-sm mb-4 opacity-80">{c.description}</p>}
            
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mt-2 pt-4 border-t border-slate-200 dark:border-slate-600">
              <div className="flex items-center gap-3 text-sm">
                <span className="font-semibold px-3 py-1 rounded-full bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-300">
                  {c.attendeesCount || 0} Registered
                </span>
                <span className="text-slate-500 font-medium">{Math.max(0, c.totalSlots - (c.attendeesCount || 0))} slots available</span>
              </div>
              
              {activeTab === "available" ? (
                <div className="flex gap-2 w-full sm:w-auto">
                  {(() => {
                    const isCampTooSoon = eligibility && !eligibility.isEligibleNow && new Date(c.date) < new Date(eligibility.nextEligibleDate);
                    const btnDisabled = hasActiveRegistration || isCampTooSoon;
                    let btnText = "Apply";
                    if (isCampTooSoon) btnText = "Too Soon";
                    
                    return (
                      <button
                        onClick={() => !btnDisabled && setSelectedCampId(c._id)}
                        disabled={btnDisabled}
                        className={`flex-1 sm:flex-none px-6 py-2 font-semibold rounded-lg transition-all ${
                          btnDisabled
                            ? "bg-slate-200 text-slate-400 dark:bg-slate-700 dark:text-slate-500 cursor-not-allowed"
                            : "bg-red-600 hover:bg-red-700 text-white shadow-md shadow-red-500/20"
                        }`}
                        title={isCampTooSoon ? "This camp falls before your 56-day cooldown ends." : ""}
                      >
                        {btnText}
                      </button>
                    );
                  })()}
                </div>
              ) : (
                <div className="flex gap-2 w-full sm:w-auto">
                  {c.status === "pending_completion" ? (
                    <span className="px-6 py-2 font-semibold rounded-lg bg-yellow-100 text-yellow-700 border-yellow-300 dark:bg-yellow-500/20 dark:text-yellow-400 cursor-default">
                      Pending Approval
                    </span>
                  ) : c.status === "rejected" ? (
                    <span className="px-6 py-2 font-semibold rounded-lg bg-slate-100 text-slate-500 dark:bg-slate-600 dark:text-slate-400 cursor-default">
                      Not Attended
                    </span>
                  ) : isCampPast(c) ? (
                    <button
                      onClick={() => handleCompleteClick(c._id)}
                      className="px-6 py-2 font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white shadow-md shadow-indigo-500/20"
                    >
                      Complete Donation
                    </button>
                  ) : (
                    <span className="px-6 py-2 font-semibold rounded-lg bg-emerald-100 text-emerald-700 border-emerald-300 dark:bg-emerald-500/20 dark:text-emerald-400 cursor-default">
                      Registered ✓
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        ))}
        {displayedCamps.length === 0 && (
          <div className="text-center py-10 opacity-60">
            <span className="text-4xl block mb-2">🏕️</span>
            <p>No {activeTab} camps available at the moment.</p>
          </div>
        )}
      </div>

      {/* Registration Modal */}
      {selectedCampId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-xl p-6 rounded-2xl shadow-xl mt-20 sm:mt-0 ${darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"}`}>
            <h3 className="text-xl font-bold mb-1">Camp Registration</h3>
            <p className={`text-sm mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Please provide your details and health information.</p>
            
            <form onSubmit={handleApply} className="space-y-4">
              
              {/* User Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input 
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input 
                    type="text" 
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300"}`}
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium mb-1">Address</label>
                  <input 
                    type="text" 
                    required
                    value={formData.address}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300"}`}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Blood Group</label>
                  <select 
                    required
                    value={formData.bloodGroup}
                    onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                    className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300"}`}
                  >
                    <option value="">Select Group</option>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(bg => (
                      <option key={bg} value={bg}>{bg}</option>
                    ))}
                  </select>
                </div>
              </div>

              <hr className={`my-4 ${darkMode ? "border-slate-600" : "border-slate-200"}`} />

              <h4 className="font-semibold text-md mb-2">Health Details (Yes / No)</h4>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <label className="font-medium text-sm">Are you Thalassemic?</label>
                  <input 
                    type="checkbox" 
                    checked={formData.healthDetails.isThalassemic} 
                    onChange={(e) => setFormData({...formData, healthDetails: {...formData.healthDetails, isThalassemic: e.target.checked}})}
                    className="w-5 h-5 accent-red-600"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <label className="font-medium text-sm">Have Hepatitis?</label>
                  <input 
                    type="checkbox" 
                    checked={formData.healthDetails.hasHepatitis} 
                    onChange={(e) => setFormData({...formData, healthDetails: {...formData.healthDetails, hasHepatitis: e.target.checked}})}
                    className="w-5 h-5 accent-red-600"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <label className="font-medium text-sm">High Blood Pressure?</label>
                  <input 
                    type="checkbox" 
                    checked={formData.healthDetails.hasHighBloodPressure} 
                    onChange={(e) => setFormData({...formData, healthDetails: {...formData.healthDetails, hasHighBloodPressure: e.target.checked}})}
                    className="w-5 h-5 accent-red-600"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <label className="font-medium text-sm">Have Diabetes/Sugar?</label>
                  <input 
                    type="checkbox" 
                    checked={formData.healthDetails.hasDiabetes} 
                    onChange={(e) => setFormData({...formData, healthDetails: {...formData.healthDetails, hasDiabetes: e.target.checked}})}
                    className="w-5 h-5 accent-red-600"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <label className="font-medium text-sm">Have STD?</label>
                  <input 
                    type="checkbox" 
                    checked={formData.healthDetails.hasSTD} 
                    onChange={(e) => setFormData({...formData, healthDetails: {...formData.healthDetails, hasSTD: e.target.checked}})}
                    className="w-5 h-5 accent-red-600"
                  />
                </div>

                <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                  <label className="font-medium text-sm">Regular Smoker?</label>
                  <input 
                    type="checkbox" 
                    checked={formData.healthDetails.isSmoker} 
                    onChange={(e) => setFormData({...formData, healthDetails: {...formData.healthDetails, isSmoker: e.target.checked}})}
                    className="w-5 h-5 accent-red-600"
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-200 dark:border-slate-600">
                <button 
                  type="button" 
                  onClick={() => setSelectedCampId(null)}
                  className={`flex-1 py-2.5 font-semibold rounded-lg ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={submitting}
                  className="flex-1 py-2.5 font-semibold rounded-lg bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
                >
                  {submitting ? "Submitting..." : "Submit Application"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm overflow-y-auto">
          <div className={`w-full max-w-xl p-6 rounded-2xl shadow-xl mt-20 sm:mt-0 ${darkMode ? "bg-slate-800 text-white" : "bg-white text-slate-800"}`}>
            <h3 className="text-xl font-bold mb-1">Complete Donation</h3>
            <p className={`text-sm mb-5 ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Please provide details of your camp visit.</p>
            
            <form onSubmit={submitCompletion} className="space-y-4">
              <div className="flex justify-between items-center p-3 rounded-lg bg-slate-50 dark:bg-slate-700/50">
                <label className="font-medium text-sm">Did you attend the camp and donate blood?</label>
                <input 
                  type="checkbox" 
                  checked={completionData.attended} 
                  onChange={(e) => setCompletionData({...completionData, attended: e.target.checked})}
                  className="w-5 h-5 accent-indigo-600"
                />
              </div>

              {completionData.attended && (
                <>
                  <div>
                    <label className="block text-sm font-medium mb-1">Visit Timing (Approx)</label>
                    <input 
                      type="text" 
                      placeholder="e.g. 10:30 AM"
                      required
                      value={completionData.visitTiming}
                      onChange={(e) => setCompletionData({...completionData, visitTiming: e.target.value})}
                      className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Certificate Link / URL (Optional)</label>
                    <input 
                      type="text" 
                      placeholder="Paste link to uploaded certificate"
                      value={completionData.certificateUrl}
                      onChange={(e) => setCompletionData({...completionData, certificateUrl: e.target.value})}
                      className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300"}`}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Feedback / Experience</label>
                    <textarea 
                      rows="3"
                      placeholder="How was your experience?"
                      required
                      value={completionData.feedback}
                      onChange={(e) => setCompletionData({...completionData, feedback: e.target.value})}
                      className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-700 border-slate-600 text-white" : "bg-white border-slate-300"}`}
                    ></textarea>
                  </div>
                </>
              )}

              <div className="flex gap-3 pt-4 mt-2 border-t border-slate-200 dark:border-slate-600">
                <button 
                  type="button" 
                  onClick={() => setShowCompletionModal(false)}
                  className={`flex-1 py-2.5 font-semibold rounded-lg ${darkMode ? "bg-slate-700 hover:bg-slate-600 text-white" : "bg-slate-100 hover:bg-slate-200 text-slate-700"}`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className={`flex-1 py-2.5 font-semibold rounded-lg text-white disabled:opacity-50 shadow-md ${
                    completionData.attended
                      ? "bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20"
                      : "bg-slate-600 hover:bg-slate-700 shadow-slate-500/20"
                  }`}
                >
                  {submitting ? "Submitting..." : completionData.attended ? "Submit for Approval" : "Mark as Not Attended"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationCamps;
