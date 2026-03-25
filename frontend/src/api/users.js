import http from "./http";

export const fetchUsers = async () => {
  const { data } = await http.get("/users");
  return data;
};

export const fetchEmployees = async () => {
  const { data } = await http.get("/users/employees");
  return data;
};

export const createUser = async (payload) => {
  const { data } = await http.post("/users", payload);
  return data;
};

export const updateUser = async (id, payload) => {
  const { data } = await http.put(`/users/${id}`, payload);
  return data;
};

export const deleteUser = async (id) => {
  const { data } = await http.delete(`/users/${id}`);
  return data;
};
