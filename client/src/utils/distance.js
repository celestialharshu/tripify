// straight-line ("as the crow flies") distance between two coordinates, in km
// this is what we use for travel modes that don't follow a road network, like flights
export const haversineDistanceKm = (a, b) => {
  const earthRadiusKm = 6371;
  const toRad = (deg) => (deg * Math.PI) / 180;

  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);

  const sinDLat = Math.sin(dLat / 2);
  const sinDLng = Math.sin(dLng / 2);

  const centralAngle =
    sinDLat * sinDLat + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * sinDLng * sinDLng;

  return 2 * earthRadiusKm * Math.asin(Math.sqrt(centralAngle));
};

// turns a number of minutes into something readable, e.g. "6 hr 30 min"
export const formatDuration = (totalMinutes) => {
  const hours = Math.floor(totalMinutes / 60);
  const minutes = Math.round(totalMinutes % 60);

  if (hours === 0) return `${minutes} min`;
  if (minutes === 0) return `${hours} hr`;
  return `${hours} hr ${minutes} min`;
};

// adds the human readable text fields onto a {distanceKm, durationMin} route object
export const formatRoute = (route) => ({
  ...route,
  distanceText: `${Math.round(route.distanceKm)} km`,
  durationText: formatDuration(route.durationMin),
});
