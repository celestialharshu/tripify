const ORS_KEY = import.meta.env.VITE_ORS_API_KEY;

// Convert place name -> coordinates using OpenStreetMap Nominatim
export async function geocode(place) {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
      place
    )}&format=json&limit=1`,
    {
      headers: {
        "User-Agent": "Tripify",
      },
    }
  );

  const data = await res.json();

  if (!data.length) {
    throw new Error("Location not found");
  }

  return {
    lat: parseFloat(data[0].lat),
    lng: parseFloat(data[0].lon),
  };
}

// Get driving route
export async function getRoute(origin, destination) {
  const res = await fetch(
    "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
    {
      method: "POST",
      headers: {
        Authorization: ORS_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        coordinates: [
          [origin.lng, origin.lat],
          [destination.lng, destination.lat],
        ],
      }),
    }
  );

  if (!res.ok) throw new Error("Failed to calculate route");

  const data = await res.json();

  const feature = data.features[0];

  return {
    coordinates: feature.geometry.coordinates.map(([lng, lat]) => [lat, lng]),
    distance: feature.properties.summary.distance,
    duration: feature.properties.summary.duration,
  };
}