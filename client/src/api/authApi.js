import axiosInstance from "./axiosInstance";

export const registerUser = async (name, email, password) => {
  const { data } = await axiosInstance.post("/auth/register", { name, email, password });
  return data;
};

export const loginUser = async (email, password) => {
  const { data } = await axiosInstance.post("/auth/login", { email, password });
  return data;
};

export const fetchCurrentUser = async () => {
  const { data } = await axiosInstance.get("/auth/me");
  return data;
};
