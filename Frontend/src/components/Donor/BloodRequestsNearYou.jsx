import React, { useState, useEffect } from "react";
import { useTheme } from "../../context/ThemeContext";
import { donorAPI } from "../../services/api";
import toast from "react-hot-toast";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Fix leaflet icon paths
import iconUrl from "leaflet/dist/images/marker-icon.png";
import iconRetinaUrl from "leaflet/dist/images/marker-icon-2x.png";
import shadowUrl from "leaflet/dist/images/marker-shadow.png";

const DefaultIcon = L.icon({
  iconUrl,
  iconRetinaUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

// Custom Urgent Icon
const UrgentIcon = L.icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png",
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

const BloodRequestsNearYou = () => {
  const { darkMode } = useTheme();
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    donorAPI.getUrgentRequests().then(setRequests).catch(console.error);
  }, []);

  const getColor = (level) => {
    switch (level) {
      case "critical": return "bg-red-100 text-red-600";
      case "high": return "bg-orange-100 text-orange-600";
      case "medium": return "bg-yellow-100 text-yellow-600";
      default: return "";
    }
  };

  const handleRespond = async (id) => {
    try {
      await donorAPI.respondToRequest(id);
      toast.success("Successfully responded to blood request!");
      setRequests((prev) => prev.map((r) => r._id === id ? { ...r, hasResponded: true } : r));
    } catch (err) {
      toast.error(err.message);
    }
  };

  return (
    <div
      className={`p-4 rounded-xl border shadow-sm ${
        darkMode ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-200 text-gray-800"
      }`}
    >
      <h3 className="font-semibold mb-1">📍 Blood Requests Near You</h3>
      <p className={`text-sm mb-3 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
        Find urgent blood requests in your area
      </p>

      <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 mb-4 relative z-0">
        <MapContainer center={[20.5937, 78.9629]} zoom={5} style={{ height: "100%", width: "100%", zIndex: 1 }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          {requests.map(r => r.location?.lat ? (
            <Marker 
              key={r._id} 
              position={[r.location.lat, r.location.lng]}
              icon={r.urgency === 'critical' || r.urgency === 'high' ? UrgentIcon : DefaultIcon}
            >
              <Popup>
                <div className="text-sm font-sans">
                  <strong>{r.hospital}</strong><br/>
                  Needed: {r.units} units of <span className="text-red-500 font-bold">{r.bloodType}</span><br/>
                  Urgency: <span className="capitalize">{r.urgency}</span>
                </div>
              </Popup>
            </Marker>
          ) : null)}
        </MapContainer>
      </div>

      <div className="space-y-3">
        {requests.map((r) => (
          <div
            key={r._id}
            className={`p-3 rounded-lg transition ${darkMode ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-50 hover:bg-gray-100"}`}
          >
            <div className="flex justify-between items-center">
              <div>
                <span className={`text-xs px-2 py-1 rounded-full ${getColor(r.urgency)}`}>{r.urgency}</span>
                <h4 className="font-semibold mt-1">
                  {r.hospital}{" "}
                  <span className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>({r.bloodType})</span>
                </h4>
                <p className="text-sm text-gray-500">{r.details}</p>
                <p className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-400"}`}>
                  {r.distance} km • {r.postedAgo} ago • {r.units} units needed
                </p>
              </div>
              <div className="flex flex-col gap-1">
                <button
                  onClick={() => handleRespond(r._id)}
                  disabled={r.hasResponded}
                  className={`${r.hasResponded ? "bg-gray-400 cursor-not-allowed dark:bg-gray-600" : "bg-red-500 hover:bg-red-600"} text-white px-3 py-1 rounded-md transition-colors`}
                >
                  {r.hasResponded ? "Responded" : "Respond"}
                </button>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(r.hospital)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`border text-sm px-3 py-1 rounded-md text-center ${
                    darkMode ? "border-gray-600 text-gray-300 hover:bg-gray-700" : "border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  Get Directions
                </a>
              </div>
            </div>
          </div>
        ))}
        {requests.length === 0 && (
          <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No blood requests near you</p>
        )}
      </div>
    </div>
  );
};

export default BloodRequestsNearYou;
