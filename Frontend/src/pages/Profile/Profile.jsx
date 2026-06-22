import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { donorAPI, hospitalAPI, authAPI } from "../../services/api";
import { motion } from "framer-motion";
import MapPicker from "../../components/MapPicker";
import toast from "react-hot-toast";

const Profile = () => {
  const { darkMode } = useTheme();
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [pwMsg, setPwMsg] = useState("");

  useEffect(() => {
    const fetchProfile = user?.role === "Donor" ? donorAPI.getProfile : hospitalAPI.getProfile;
    fetchProfile()
      .then((data) => {
        const userProfile = user?.role === "Donor" ? data.donor : data.hospital;
        setProfile(userProfile);
        setForm({ 
          name: userProfile.name, phone: userProfile.phone, address: userProfile.address, city: userProfile.city, region: userProfile.region, bloodType: userProfile.bloodType,
          location: { address: userProfile.address || "", lat: userProfile.latitude || 20.5937, lng: userProfile.longitude || 78.9629 }
        });
      })
      .catch(console.error);
  }, [user]);

  const handleSave = async () => {
    setSaving(true);
    setMessage("");
    try {
      const updateFn = user?.role === "Donor" ? donorAPI.updateProfile : hospitalAPI.updateProfile;
      const payload = { ...form };
      if (form.location) {
        payload.address = form.location.address;
        payload.latitude = form.location.lat;
        payload.longitude = form.location.lng;
      }
      const updatedResponse = await updateFn(payload);
      const updatedUser = user?.role === "Donor" ? updatedResponse.donor : updatedResponse.hospital;
      
      setProfile((prev) => ({ ...prev, ...updatedUser }));
      setEditing(false);
      setMessage("Profile updated successfully!");
      localStorage.setItem("name", updatedUser.name);
    } catch (err) {
      setMessage(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleSearchAddress = async () => {
    if (!form.location?.address) {
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
            address: firstResult.display_name
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

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setPwMsg("");
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setPwMsg("New passwords don't match");
      return;
    }
    try {
      const result = await authAPI.changePassword(passwordForm.currentPassword, passwordForm.newPassword);
      setPwMsg(result.message);
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPwMsg(err.message);
    }
  };

  if (!profile) return null;

  const inputClass = `w-full p-3 rounded-xl outline-none transition-all duration-300 mt-1 ${
    darkMode 
      ? "bg-slate-800/50 border border-slate-700 focus:bg-slate-800 focus:border-red-500/50 text-white" 
      : "bg-slate-50 border border-slate-200 focus:bg-white focus:border-rose-300 focus:shadow-md"
  }`;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } }
  };

  return (
    <div className={`min-h-screen transition-colors duration-500 ${darkMode ? "bg-slate-950 text-white" : "bg-rose-50 text-slate-900"}`}>
      <Navbar />
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-red-500 to-rose-600 mb-6">
            My Profile
          </h1>
        </motion.div>

        {message && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${message.includes("success") ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600" : "bg-red-500/10 border border-red-500/20 text-red-600"}`}>
            <div className={`w-2 h-2 rounded-full ${message.includes("success") ? "bg-emerald-500" : "bg-red-500"}`} />
            {message}
          </motion.div>
        )}

        <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
          {/* Profile Info */}
          <motion.div variants={itemVariants} className={`p-8 rounded-3xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${darkMode ? "bg-slate-900/60 border-slate-700/50" : "bg-white/70 border-white"}`}>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
              <h2 className="font-bold text-xl flex items-center gap-2 text-red-500">
                <span className="text-2xl">👤</span> Personal Information
              </h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => editing ? handleSave() : setEditing(true)}
                disabled={saving}
                className={`px-6 py-2 rounded-xl text-sm font-medium transition-all shadow-md ${
                  editing ? "bg-gradient-to-r from-emerald-500 to-green-600 text-white" : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                }`}
              >
                {saving ? "Saving..." : editing ? "Save Changes" : "Edit Profile"}
              </motion.button>
            </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium">Name</label>
              {editing ? (
                <input type="text" value={form.name || ""} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} />
              ) : (
                <p className="mt-1">{profile.name}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <p className="mt-1 text-gray-500">{profile.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium">Role</label>
              <p className="mt-1">
                <span className="bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full text-xs">{profile.role}</span>
              </p>
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              {editing ? (
                <input type="text" value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} className={inputClass} />
              ) : (
                <p className="mt-1">{profile.phone || "Not set"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">City</label>
              {editing ? (
                <input type="text" value={form.city || ""} onChange={(e) => setForm({ ...form, city: e.target.value })} className={inputClass} />
              ) : (
                <p className="mt-1">{profile.city || "Not set"}</p>
              )}
            </div>
            <div>
              <label className="text-sm font-medium">Region</label>
              {editing ? (
                <select value={form.region || ""} onChange={(e) => setForm({ ...form, region: e.target.value })} className={inputClass}>
                  <option value="">Select</option>
                  <option value="North">North</option>
                  <option value="South">South</option>
                  <option value="East">East</option>
                  <option value="West">West</option>
                </select>
              ) : (
                <p className="mt-1">{profile.region || "Not set"}</p>
              )}
            </div>
            {user?.role === "Donor" && (
              <div>
                <label className="text-sm font-medium">Blood Type</label>
                {editing ? (
                  <select value={form.bloodType || ""} onChange={(e) => setForm({ ...form, bloodType: e.target.value })} className={inputClass}>
                    {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                ) : (
                  <p className="mt-1">
                    <span className="bg-red-100 text-red-600 px-2 py-0.5 rounded-full text-xs">{profile.bloodType || "Not set"}</span>
                  </p>
                )}
              </div>
            )}
            <div className="sm:col-span-2">
              <label className="text-sm font-medium">Address</label>
              {editing ? (
                <div className="space-y-3 mt-1">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      value={form.location?.address || ""} 
                      onChange={(e) => setForm({ ...form, location: { ...form.location, address: e.target.value } })} 
                      className={`flex-1 p-3 rounded-xl outline-none transition-all duration-300 ${darkMode ? "bg-slate-800/50 border border-slate-700 focus:bg-slate-800 text-white" : "bg-slate-50 border border-slate-200 focus:bg-white"}`} 
                    />
                    <button 
                      type="button" 
                      onClick={handleSearchAddress}
                      className="px-4 py-3 bg-slate-700 hover:bg-slate-800 dark:bg-slate-600 dark:hover:bg-slate-500 text-white rounded-xl text-sm font-semibold transition-colors shadow-sm"
                    >
                      Search Map
                    </button>
                  </div>
                  <div className="w-full">
                    <MapPicker location={form.location} setLocation={(loc) => setForm({ ...form, location: loc })} />
                  </div>
                </div>
              ) : (
                <p className="mt-1">{profile.address || "Not set"}</p>
              )}
            </div>
          </div>

            {/* Donor Stats */}
            {profile.donorProfile && (
              <div className={`mt-8 pt-6 border-t ${darkMode ? "border-slate-800" : "border-slate-200"}`}>
                <h3 className="font-bold text-lg mb-4 text-red-500 flex items-center gap-2">
                  <span className="text-2xl">🩸</span> Donor Statistics
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                  {[
                    { label: "Donations", value: profile.donorProfile.totalDonations },
                    { label: "Points", value: profile.donorProfile.totalPoints },
                    { label: "Level", value: profile.donorProfile.level },
                    { label: "Lives Saved", value: profile.donorProfile.livesSaved },
                  ].map((s, i) => (
                    <motion.div whileHover={{ y: -5 }} key={i} className={`p-4 rounded-2xl text-center transition-colors ${darkMode ? "bg-slate-800/80" : "bg-slate-50/80 border border-slate-100"}`}>
                      <p className="text-3xl font-extrabold">{s.value}</p>
                      <p className={`text-xs font-medium mt-1 uppercase tracking-wider ${darkMode ? "text-red-400" : "text-red-500"}`}>{s.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>

          {/* Change Password */}
          <motion.div variants={itemVariants} className={`p-8 rounded-3xl shadow-lg backdrop-blur-sm border transition-all duration-300 ${darkMode ? "bg-slate-900/60 border-slate-700/50" : "bg-white/70 border-white"}`}>
            <h2 className="font-bold text-xl mb-6 text-slate-500 flex items-center gap-2">
              <span className="text-2xl">🔒</span> Change Password
            </h2>
            {pwMsg && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className={`p-4 rounded-xl mb-6 text-sm font-medium flex items-center gap-2 ${pwMsg.includes("success") ? "bg-emerald-500/10 border border-emerald-500/20 text-emerald-600" : "bg-red-500/10 border border-red-500/20 text-red-600"}`}>
                <div className={`w-2 h-2 rounded-full ${pwMsg.includes("success") ? "bg-emerald-500" : "bg-red-500"}`} />
                {pwMsg}
              </motion.div>
            )}
            <form onSubmit={handlePasswordChange} className="space-y-4 max-w-md">
              <div>
                <label className="text-sm font-medium ml-1">Current Password</label>
                <input
                  type="password"
                  value={passwordForm.currentPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                  required
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium ml-1">New Password</label>
                <input
                  type="password"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                  required
                  minLength={6}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="text-sm font-medium ml-1">Confirm New Password</label>
                <input
                  type="password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                  required
                  minLength={6}
                  className={inputClass}
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit" 
                className="w-full mt-4 px-6 py-3 bg-slate-800 hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600 text-white rounded-xl text-sm font-medium transition-colors shadow-md"
              >
                Update Password
              </motion.button>
            </form>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
