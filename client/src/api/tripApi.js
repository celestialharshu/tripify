import axiosInstance from "./axiosInstance";

export const createTrip = async (tripData) => {
  const { data } = await axiosInstance.post("/trips", tripData);
  return data;
};

export const getMyTrips = async () => {
  const { data } = await axiosInstance.get("/trips");
  return data;
};

export const updateTrip = async (id, updates) => {
  const { data } = await axiosInstance.put(`/trips/${id}`, updates);
  return data;
};

export const deleteTrip = async (id) => {
  const { data } = await axiosInstance.delete(`/trips/${id}`);
  return data;
};
