import React, { useState, useEffect } from "react";
import Navbar from "../../components/Navbar";
import { useTheme } from "../../context/ThemeContext";
import { notificationAPI } from "../../services/api";

const Notifications = () => {
  const { darkMode } = useTheme();
  const [data, setData] = useState({ notifications: [], unreadCount: 0 });

  useEffect(() => {
    notificationAPI.getAll().then(setData).catch(console.error);
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationAPI.markAsRead();
      setData((prev) => ({
        ...prev,
        unreadCount: 0,
        notifications: prev.notifications.map((n) => ({ ...n, read: true })),
      }));
    } catch (err) {
      console.error(err);
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "success": return "border-l-green-500 bg-green-50";
      case "warning": return "border-l-yellow-500 bg-yellow-50";
      case "error": return "border-l-red-500 bg-red-50";
      default: return "border-l-blue-500 bg-blue-50";
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case "success": return "✅";
      case "warning": return "⚠️";
      case "error": return "🚨";
      default: return "ℹ️";
    }
  };

  return (
    <div className={`min-h-screen ${darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"}`}>
      <Navbar />
      <div className="px-6 py-4 max-w-3xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h1 className="text-xl font-semibold">Notifications</h1>
            <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              {data.unreadCount > 0 ? `${data.unreadCount} unread` : "All caught up!"}
            </p>
          </div>
          {data.unreadCount > 0 && (
            <button
              onClick={handleMarkAllRead}
              className="text-sm text-blue-500 hover:text-blue-600"
            >
              Mark all as read
            </button>
          )}
        </div>

        <div className="space-y-3">
          {data.notifications.length === 0 ? (
            <div className={`p-8 text-center rounded-xl border ${darkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"}`}>
              <p className="text-4xl mb-2">🔔</p>
              <p className={`${darkMode ? "text-gray-400" : "text-gray-500"}`}>No notifications yet</p>
            </div>
          ) : (
            data.notifications.map((n) => (
              <div
                key={n._id}
                className={`p-4 rounded-lg border-l-4 ${
                  darkMode
                    ? `bg-gray-800 border-gray-700 ${!n.read ? "ring-1 ring-blue-500/30" : ""}`
                    : `${getTypeColor(n.type)} ${!n.read ? "ring-1 ring-blue-300" : ""}`
                }`}
              >
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getTypeIcon(n.type)}</span>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`font-semibold ${!n.read ? "" : darkMode ? "text-gray-300" : "text-gray-600"}`}>
                        {n.title}
                      </h4>
                      <span className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        {new Date(n.createdAt).toLocaleDateString()} {new Date(n.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </span>
                    </div>
                    <p className={`text-sm mt-1 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>{n.message}</p>
                    {!n.read && <span className="inline-block mt-1 text-xs text-blue-500 font-medium">New</span>}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
