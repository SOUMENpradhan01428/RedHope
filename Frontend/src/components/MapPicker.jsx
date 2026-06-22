import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
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

function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng);
    },
  });

  useEffect(() => {
    if (position && position.lat && position.lng) {
      map.flyTo([position.lat, position.lng], map.getZoom() < 13 ? 13 : map.getZoom(), {
        animate: true,
      });
    }
  }, [position, map]);

  return position === null ? null : (
    <Marker position={position} />
  );
}

const MapPicker = ({ location, setLocation }) => {
  const [position, setPosition] = useState({ lat: location.lat || 20.5937, lng: location.lng || 78.9629 });

  useEffect(() => {
    // Try to get user's actual location if not set yet
    if (navigator.geolocation && (!location.lat || location.lat === 51.505 || location.lat === 20.5937)) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setPosition({ lat: latitude, lng: longitude });
          setLocation({ ...location, lat: latitude, lng: longitude });
        },
        () => {
          // fallback to default
        }
      );
    }
  }, []);

  // Sync external location changes (like from Search) to the internal position state
  useEffect(() => {
    if (location.lat && location.lng && (location.lat !== position.lat || location.lng !== position.lng)) {
      setPosition({ lat: location.lat, lng: location.lng });
    }
  }, [location.lat, location.lng]);

  useEffect(() => {
    if (position.lat !== location.lat || position.lng !== location.lng) {
      // Only do reverse geocoding if it's a specific coordinate, not the default India center
      if (position.lat !== 20.5937 && position.lng !== 78.9629) {
        fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${position.lat}&lon=${position.lng}`)
          .then(res => res.json())
          .then(data => {
            if (data && data.display_name) {
              setLocation({ ...location, lat: position.lat, lng: position.lng, address: data.display_name });
            } else {
              setLocation({ ...location, lat: position.lat, lng: position.lng });
            }
          })
          .catch(() => {
            setLocation({ ...location, lat: position.lat, lng: position.lng });
          });
      } else {
        setLocation({ ...location, lat: position.lat, lng: position.lng });
      }
    }
  }, [position]);

  return (
    <div className="w-full h-64 rounded-xl overflow-hidden border border-gray-300 dark:border-gray-700 z-0">
      <MapContainer center={position} zoom={location.lat && location.lat !== 20.5937 ? 13 : 5} style={{ height: "100%", width: "100%", zIndex: 1 }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <LocationMarker position={position} setPosition={setPosition} />
      </MapContainer>
    </div>
  );
};

export default MapPicker;
