import { haversineDistanceKm, formatDuration } from "./distance";

// trains don't travel in a perfectly straight line, so we pad the straight-line
// distance a bit to land closer to a real route length
const TRAIN_ROUTE_FACTOR = 1.2;
const TRAIN_AVG_SPEED_KMH = 55;

// flights stay close to the straight line, but the total door-to-door time
// needs to account for check-in, security and boarding, not just flight time
const FLIGHT_AVG_SPEED_KMH = 700;
const FLIGHT_GROUND_BUFFER_MIN = 90;

// below this distance flying isn't really a practical option
export const MIN_FLIGHT_DISTANCE_KM = 150;

export const estimateTrain = (origin, destination) => {
  const distanceKm = haversineDistanceKm(origin, destination) * TRAIN_ROUTE_FACTOR;
  const durationMin = (distanceKm / TRAIN_AVG_SPEED_KMH) * 60;

  return {
    distanceKm,
    durationMin,
    distanceText: `${Math.round(distanceKm)} km`,
    durationText: formatDuration(durationMin),
  };
};

export const estimateFlight = (origin, destination) => {
  const distanceKm = haversineDistanceKm(origin, destination);
  const durationMin = (distanceKm / FLIGHT_AVG_SPEED_KMH) * 60 + FLIGHT_GROUND_BUFFER_MIN;

  return {
    distanceKm,
    durationMin,
    distanceText: `${Math.round(distanceKm)} km`,
    durationText: formatDuration(durationMin),
  };
};
