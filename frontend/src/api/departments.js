import http from "./http";

export const fetchDepartments = async () => {
  const { data } = await http.get("/departments");
  return data;
};

export const createDepartment = async (payload) => {
  const { data } = await http.post("/departments", payload);
  return data;
};

export const updateDepartment = async (id, payload) => {
  const { data } = await http.put(`/departments/${id}`, payload);
  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await http.delete(`/departments/${id}`);
  return data;
};
