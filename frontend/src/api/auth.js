import http from "./http";

export const loginRequest = async (payload) => {
  const { data } = await http.post("/auth/login", payload);
  return data;
};

export const registerRequest = async (payload) => {
  const { data } = await http.post("/auth/register", payload);
  return data;
};
