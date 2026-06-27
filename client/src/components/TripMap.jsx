import { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  Popup,
} from "react-leaflet";
import L from "leaflet";

import { geocode, getRoute } from "../api/openRouteApi";
import "./TripMap.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const INDIA_CENTER = [22.9734, 78.6569];

const TripMap = ({ origin, destination, onRouteFound }) => {
  const [loading, setLoading] = useState(false);
  const [route, setRoute] = useState([]);
  const [originPos, setOriginPos] = useState(null);
  const [destinationPos, setDestinationPos] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!origin || !destination) return;

    const loadRoute = async () => {
      try {
        setLoading(true);
        setError("");

        const start = await geocode(origin);
        const end = await geocode(destination);

        setOriginPos([start.lat, start.lng]);
        setDestinationPos([end.lat, end.lng]);

        const data = await getRoute(start, end);

        setRoute(data.coordinates);

        onRouteFound({
          distanceText: `${(data.distance / 1000).toFixed(1)} km`,
          durationText: `${Math.round(data.duration / 60)} mins`,
        });
      } catch (err) {
        console.error(err);
        setError("Unable to calculate route.");
      } finally {
        setLoading(false);
      }
    };

    loadRoute();
  }, [origin, destination]);

  return (
    <div className="trip-map-wrapper">

      {loading && (
        <div className="trip-map-message">
          Calculating route...
        </div>
      )}

      {error && (
        <div className="trip-map-error">
          {error}
        </div>
      )}

      <MapContainer
        center={originPos || INDIA_CENTER}
        zoom={5}
        style={{ height: "420px", width: "100%" }}
      >
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {originPos && (
          <Marker position={originPos}>
            <Popup>Start</Popup>
          </Marker>
        )}

        {destinationPos && (
          <Marker position={destinationPos}>
            <Popup>Destination</Popup>
          </Marker>
        )}

        {route.length > 0 && (
          <Polyline
            positions={route}
            pathOptions={{
              color: "#0d9488",
              weight: 5,
            }}
          />
        )}
      </MapContainer>
    </div>
  );
};

export default TripMap;