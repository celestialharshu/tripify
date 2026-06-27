import { useState, useCallback, useEffect } from "react";
import {
  GoogleMap,
  useJsApiLoader,
  DirectionsService,
  DirectionsRenderer,
} from "@react-google-maps/api";
import { useTheme } from "../context/ThemeContext";
import "./TripMap.css";

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

// default center (India) shown before a route has been calculated
const defaultCenter = { lat: 22.9734, lng: 78.6569 };

// a simple muted map style for dark mode so the map doesn't look out of place
const darkMapStyle = [
  { elementType: "geometry", stylers: [{ color: "#16241f" }] },
  { elementType: "labels.text.fill", stylers: [{ color: "#9fb3ae" }] },
  { elementType: "labels.text.stroke", stylers: [{ color: "#16241f" }] },
  { featureType: "road", elementType: "geometry", stylers: [{ color: "#233331" }] },
  { featureType: "water", elementType: "geometry", stylers: [{ color: "#0e1716" }] },
  { featureType: "poi", elementType: "geometry", stylers: [{ color: "#1c3330" }] },
];

// origin/destination are plain place names typed by the user (e.g. "Jammu", "Srinagar")
// onRouteFound is called with { distanceText, durationText } once Google calculates the route
const TripMap = ({ origin, destination, onRouteFound }) => {
  const { theme } = useTheme();
  const [directions, setDirections] = useState(null);
  const [mapError, setMapError] = useState("");

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
  });

  // a fresh search means we need a fresh route, so clear out the old one
  // this lets DirectionsService run again for the new origin/destination pair
  useEffect(() => {
    setDirections(null);
    setMapError("");
  }, [origin, destination]);

  // called once by DirectionsService whenever origin/destination changes
  const directionsCallback = useCallback(
    (result, status) => {
      if (status === "OK" && result) {
        setDirections(result);
        setMapError("");

        const leg = result.routes[0].legs[0];
        onRouteFound({
          distanceText: leg.distance.text,
          durationText: leg.duration.text,
        });
      } else {
        setMapError("Couldn't find a driving route between these two places. Try checking the spelling.");
      }
    },
    [onRouteFound]
  );

  if (loadError) {
    return (
      <div className="trip-map-message">
        Could not load Google Maps. Double check your API key in the .env file.
      </div>
    );
  }

  if (!isLoaded) {
    return <div className="trip-map-message">Loading map…</div>;
  }

  return (
    <div className="trip-map-wrapper">
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={defaultCenter}
        zoom={5}
        options={{
          styles: theme === "dark" ? darkMapStyle : [],
          disableDefaultUI: false,
          zoomControl: true,
        }}
      >
        {origin && destination && !directions && (
          <DirectionsService
            options={{
              origin,
              destination,
              travelMode: "DRIVING",
            }}
            callback={directionsCallback}
          />
        )}

        {directions && <DirectionsRenderer options={{ directions }} />}
      </GoogleMap>

      {mapError && <p className="trip-map-error">{mapError}</p>}
    </div>
  );
};

export default TripMap;
