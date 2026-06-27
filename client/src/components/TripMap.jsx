import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./TripMap.css";

// little colored pin markers built from inline SVG
// (sidesteps the classic bundler issue where Leaflet's default marker images don't load)
const makePin = (color) =>
  L.divIcon({
    className: "trip-map-pin",
    html: `<svg width="26" height="26" viewBox="0 0 24 24">
      <path fill="${color}" d="M12 2C7.6 2 4 5.6 4 10c0 5.4 7 12 7.3 12.3.4.4 1 .4 1.4 0C13 22 20 15.4 20 10c0-4.4-3.6-8-8-8z"/>
      <circle cx="12" cy="10" r="3" fill="#ffffff"/>
    </svg>`,
    iconSize: [26, 26],
    iconAnchor: [13, 26],
  });

const startIcon = makePin("#fb7185");
const endIcon = makePin("#0d9488");

// small helper component that re-centers the map to fit the whole route
// whenever a new route comes in - has to live inside <MapContainer> to use useMap()
const FitRouteBounds = ({ path }) => {
  const map = useMap();

  useEffect(() => {
    if (path && path.length > 0) {
      map.fitBounds(path, { padding: [40, 40] });
    }
  }, [path, map]);

  return null;
};

// this component only renders what it's given - all the geocoding and route
// fetching happens up in Planner.jsx so the map and the travel options panel
// can both use the same data without double-fetching
const TripMap = ({ originCoord, destinationCoord, route }) => {
  if (!originCoord || !destinationCoord) {
    return (
      <div className="trip-map-message">Search for a route above to see it on the map</div>
    );
  }

  return (
    <div className="trip-map-wrapper">
      <MapContainer
        center={[originCoord.lat, originCoord.lng]}
        zoom={6}
        style={{ width: "100%", height: "100%" }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker position={[originCoord.lat, originCoord.lng]} icon={startIcon} />
        <Marker position={[destinationCoord.lat, destinationCoord.lng]} icon={endIcon} />

        {route?.path && (
          <>
            <Polyline positions={route.path} pathOptions={{ color: "#0d9488", weight: 4 }} />
            <FitRouteBounds path={route.path} />
          </>
        )}
      </MapContainer>
    </div>
  );
};

export default TripMap;
