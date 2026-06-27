import axiosInstance from "./axiosInstance";

export const getPlaces = async () => {
  const { data } = await axiosInstance.get("/places");
  return data;
};
