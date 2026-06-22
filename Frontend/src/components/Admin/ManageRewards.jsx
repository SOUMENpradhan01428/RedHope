import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { adminAPI } from "../../services/api";
import { motion } from "framer-motion";
import { Plus, Edit2, Trash2, Power, PowerOff } from "lucide-react";
import toast from "react-hot-toast";
import ConfirmModal from "../ConfirmModal";

const ManageRewards = () => {
  const { darkMode } = useTheme();
  const [rewards, setRewards] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ title: "", description: "", pointsCost: "", icon: "🎁", isActive: true });
  const [editingId, setEditingId] = useState(null);
  const [confirmState, setConfirmState] = useState({ isOpen: false, data: null });

  useEffect(() => {
    fetchRewards();
  }, []);

  const fetchRewards = async () => {
    try {
      const data = await adminAPI.getRewards();
      setRewards(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleOpenModal = (reward = null) => {
    if (reward) {
      setEditingId(reward._id);
      setFormData({
        title: reward.title,
        description: reward.description,
        pointsCost: reward.pointsCost,
        icon: reward.icon,
        isActive: reward.isActive
      });
    } else {
      setEditingId(null);
      setFormData({ title: "", description: "", pointsCost: "", icon: "🎁", isActive: true });
    }
    setShowModal(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await adminAPI.updateReward(editingId, formData);
      } else {
        await adminAPI.createReward(formData);
      }
      setShowModal(false);
      fetchRewards();
      toast.success(editingId ? "Reward updated!" : "Reward created!");
    } catch (err) {
      toast.error("Error saving reward: " + err.message);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminAPI.deleteReward(id);
      toast.success("Reward deleted successfully");
      fetchRewards();
    } catch (err) {
      toast.error("Error deleting reward");
    }
  };

  const toggleActive = async (reward) => {
    try {
      await adminAPI.updateReward(reward._id, { isActive: !reward.isActive });
      toast.success(`Reward marked as ${!reward.isActive ? 'Active' : 'Inactive'}`);
      fetchRewards();
    } catch (err) {
      toast.error("Error toggling reward status");
    }
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
        title="Delete Reward"
        message="Are you sure you want to delete this reward? It will be removed from the donor store."
        confirmText="Delete"
        isDanger={true}
      />
      <div className={`p-6 rounded-2xl shadow-lg border ${darkMode ? "bg-slate-900 border-slate-700" : "bg-white border-slate-200"}`}>
        <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold flex items-center gap-2">🎁 Manage Rewards</h2>
          <p className={`text-sm ${darkMode ? "text-slate-400" : "text-slate-500"}`}>Add and manage store items for donors</p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
        >
          <Plus size={18} /> Add Reward
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className={`w-full text-left border-collapse ${darkMode ? "text-slate-300" : "text-slate-700"}`}>
          <thead>
            <tr className={`border-b ${darkMode ? "border-slate-700 text-slate-400" : "border-slate-200 text-slate-500"}`}>
              <th className="p-4 font-semibold">Reward</th>
              <th className="p-4 font-semibold">Points Cost</th>
              <th className="p-4 font-semibold">Status</th>
              <th className="p-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rewards.map((reward) => (
              <tr key={reward._id} className={`border-b hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors ${darkMode ? "border-slate-700" : "border-slate-200"}`}>
                <td className="p-4">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl bg-slate-100 dark:bg-slate-800 p-2 rounded-xl">{reward.icon}</span>
                    <div>
                      <p className="font-semibold">{reward.title}</p>
                      <p className="text-xs opacity-70">{reward.description}</p>
                    </div>
                  </div>
                </td>
                <td className="p-4 font-bold text-indigo-600 dark:text-indigo-400">{reward.pointsCost} pts</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    reward.isActive 
                      ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400" 
                      : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  }`}>
                    {reward.isActive ? "Active" : "Inactive"}
                  </span>
                </td>
                <td className="p-4">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleActive(reward)} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors" title="Toggle Status">
                      {reward.isActive ? <PowerOff size={18} className="text-orange-500" /> : <Power size={18} className="text-green-500" />}
                    </button>
                    <button onClick={() => handleOpenModal(reward)} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-blue-500">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => setConfirmState({ isOpen: true, data: reward._id })} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors text-red-500">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {rewards.length === 0 && (
              <tr>
                <td colSpan="4" className="p-8 text-center text-slate-500">No rewards found. Add one to get started!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`w-full max-w-md p-6 rounded-2xl shadow-2xl ${darkMode ? "bg-slate-900 border border-slate-700" : "bg-white"}`}
          >
            <h3 className="text-xl font-bold mb-4">{editingId ? "Edit Reward" : "Add New Reward"}</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm mb-1 font-medium">Title</label>
                <input required type="text" value={formData.title} onChange={(e) => setFormData({...formData, title: e.target.value})} className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`} placeholder="e.g. Free Health Checkup" />
              </div>
              <div>
                <label className="block text-sm mb-1 font-medium">Description</label>
                <textarea required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`} placeholder="Briefly describe the perk" />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm mb-1 font-medium">Points Cost</label>
                  <input required type="number" value={formData.pointsCost} onChange={(e) => setFormData({...formData, pointsCost: e.target.value})} className={`w-full p-2.5 rounded-lg border ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`} placeholder="500" />
                </div>
                <div className="flex-1">
                  <label className="block text-sm mb-1 font-medium">Icon (Emoji)</label>
                  <input type="text" value={formData.icon} onChange={(e) => setFormData({...formData, icon: e.target.value})} className={`w-full p-2.5 rounded-lg border text-center ${darkMode ? "bg-slate-800 border-slate-700" : "bg-slate-50 border-slate-200"}`} placeholder="🎁" />
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setShowModal(false)} className={`px-4 py-2 rounded-lg ${darkMode ? "hover:bg-slate-800" : "hover:bg-slate-100"}`}>Cancel</button>
                <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg">Save Reward</button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
    </>
  );
};

export default ManageRewards;
