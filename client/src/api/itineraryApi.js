import axiosInstance from "./axiosInstance";

// generates a 3-day AI itinerary for a given from -> to route
// backend proxies the actual Groq call, so no key is exposed client-side
export const generateItinerary = async (from, to) => {
  const res = await axiosInstance.post("/itinerary", { from, to });
  return res.data.itinerary;
};
