import React, { useState, useEffect, useMemo } from "react";
import { useTheme } from "../../context/ThemeContext";
import { adminAPI } from "../../services/api";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/ConfirmModal";

const UserManagement = () => {
  const { darkMode } = useTheme();
  const [allUsers, setAllUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [activeTab, setActiveTab] = useState("Donor"); // "Donor" or "Hospital"
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });

  const fetchUsers = async () => {
    try {
      // The API returns an array of users directly, not an object with { users, total }
      const data = await adminAPI.getUsers();
      if (Array.isArray(data)) {
        setAllUsers(data);
      } else if (data && data.users) {
        setAllUsers(data.users);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === "Active" ? "Inactive" : "Active";
    try {
      await adminAPI.updateUserStatus(id, newStatus);
      setAllUsers((prev) => prev.map((u) => (u._id === id ? { ...u, status: newStatus } : u)));
      toast.success("User status updated");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteUser(id);
      setAllUsers((prev) => prev.filter((u) => u._id !== id));
      toast.success("User removed successfully");
    } catch (err) {
      toast.error(err.message);
    }
  };

  // Filter and search
  const filteredUsers = useMemo(() => {
    return allUsers.filter(user => {
      // Filter by role first
      if (user.role !== activeTab) return false;
      // Then search by name or email
      if (search) {
        const query = search.toLowerCase();
        const name = (user.name || user.hospitalName || "").toLowerCase();
        const email = (user.email || "").toLowerCase();
        return name.includes(query) || email.includes(query);
      }
      return true;
    });
  }, [allUsers, activeTab, search]);

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
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
        confirmText="Delete"
        isDanger={true}
      />
      <div
        className={`p-6 rounded-2xl shadow-lg border transition-all duration-300 ${
          darkMode ? "bg-slate-900/60 border-slate-700/50 text-slate-100" : "bg-white/70 border-white text-slate-800"
        }`}
      >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="text-xl font-bold">👤 User Management</h3>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"} mt-1`}>
            Manage registered donors and hospitals. Total: {filteredUsers.length}
          </p>
        </div>

        {/* Sub-tabs */}
        <div className={`flex rounded-xl p-1.5 border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-100 border-slate-200"}`}>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "Donor"
                ? "bg-indigo-600 text-white shadow"
                : darkMode ? "text-slate-300 hover:text-white hover:bg-slate-700" : "text-slate-600 hover:bg-white"
            }`}
            onClick={() => setActiveTab("Donor")}
          >
            Donors Registered
          </button>
          <button
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
              activeTab === "Hospital"
                ? "bg-indigo-600 text-white shadow"
                : darkMode ? "text-slate-300 hover:text-white hover:bg-slate-700" : "text-slate-600 hover:bg-white"
            }`}
            onClick={() => setActiveTab("Hospital")}
          >
            Hospitals Registered
          </button>
        </div>
      </div>

      <div className="mb-6">
        <input
          className={`w-full rounded-xl p-3 border focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all ${
            darkMode ? "bg-slate-800/80 border-slate-700 text-slate-100 placeholder-slate-500" : "bg-slate-50 border-slate-200 text-slate-800 placeholder-slate-400"
          }`}
          placeholder={`Search ${activeTab.toLowerCase()}s by name or email...`}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className={`overflow-x-auto rounded-xl border ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className={`border-b ${darkMode ? "border-slate-700 bg-slate-800/50" : "bg-slate-50 border-slate-200"}`}>
              <th className="p-4 font-semibold">{activeTab === "Hospital" ? "Hospital Name" : "Name"}</th>
              <th className="p-4 font-semibold">Email</th>
              {activeTab === "Hospital" && <th className="p-4 font-semibold">License Number</th>}
              {activeTab === "Donor" && <th className="p-4 font-semibold">Blood Group</th>}
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Joined Date</th>
              <th className="p-4 font-semibold text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan="6" className={`p-8 text-center ${darkMode ? "text-slate-400" : "text-slate-500"}`}>
                  No {activeTab.toLowerCase()}s found.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user._id} className={`border-b last:border-0 transition-colors ${darkMode ? "border-slate-700/50 hover:bg-slate-800/30" : "border-slate-100 hover:bg-slate-50/50"}`}>
                  <td className="p-4 font-medium">{user.hospitalName || user.name}</td>
                  <td className="p-4 opacity-80">{user.email}</td>
                  {activeTab === "Hospital" && <td className="p-4 opacity-80">{user.licenseNumber || "N/A"}</td>}
                  {activeTab === "Donor" && <td className="p-4 font-medium text-rose-500">{user.bloodGroup || "N/A"}</td>}
                  <td className="p-4">
                    <button
                      onClick={() => toggleStatus(user._id, user.status)}
                      className={`px-3 py-1 text-xs font-semibold rounded-full transition-all hover:scale-105 active:scale-95 ${
                        user.status === "Active" || user.status === "Approved"
                          ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-500/20"
                          : "bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border border-rose-200 dark:border-rose-500/20"
                      }`}
                    >
                      {user.status}
                    </button>
                  </td>
                  <td className="p-4 opacity-80">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 text-center">
                    <button 
                      onClick={() => setConfirmState({ isOpen: true, data: user._id })} 
                      className="px-3 py-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 text-xs font-semibold transition-all"
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      </div>
    </>
  );
};

export default UserManagement;
