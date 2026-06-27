import axios from "axios";

const ORS_BASE_URL = "https://api.openrouteservice.org";
const ORS_KEY = import.meta.env.VITE_ORS_API_KEY;

// pulls a readable message out of an OpenRouteService error response,
// falling back to a generic one if the shape isn't what we expect
const getFriendlyError = (error, fallback) => {
  const orsMessage = error.response?.data?.error?.message || error.response?.data?.error;
  return new Error(orsMessage || fallback);
};

// turns a place name typed by the user (e.g. "Jammu") into real coordinates
// OpenRouteService's geocoder is a Pelias instance under the hood
export const geocodePlace = async (placeName) => {
  let data;

  try {
    const response = await axios.get(`${ORS_BASE_URL}/geocode/search`, {
      params: {
        api_key: ORS_KEY,
        text: placeName,
        size: 1,
      },
    });
    data = response.data;
  } catch (error) {
    throw getFriendlyError(error, `Couldn't look up "${placeName}" right now.`);
  }

  if (!data.features || data.features.length === 0) {
    throw new Error(`Couldn't find a place called "${placeName}". Check the spelling?`);
  }

  // GeoJSON gives coordinates as [longitude, latitude], we flip them
  // to the {lat, lng} shape the rest of the app (and Leaflet) expects
  const [lng, lat] = data.features[0].geometry.coordinates;

  return {
    lat,
    lng,
    label: data.features[0].properties.label,
  };
};

// gets a route between two coordinates for a given travel profile
// profile is "driving-car" or "foot-walking"
export const getRoute = async (origin, destination, profile = "driving-car") => {
  let data;

  try {
    const response = await axios.get(`${ORS_BASE_URL}/v2/directions/${profile}`, {
      params: {
        api_key: ORS_KEY,
        start: `${origin.lng},${origin.lat}`,
        end: `${destination.lng},${destination.lat}`,
      },
    });
    data = response.data;
  } catch (error) {
    throw getFriendlyError(error, "Couldn't calculate a route between these two places.");
  }

  const feature = data.features[0];
  const segment = feature.properties.segments[0];

  return {
    distanceKm: segment.distance / 1000,
    durationMin: segment.duration / 60,
    // again, flipping [lng, lat] pairs to [lat, lng] for Leaflet's sake
    path: feature.geometry.coordinates.map(([pointLng, pointLat]) => [pointLat, pointLng]),
  };
};
