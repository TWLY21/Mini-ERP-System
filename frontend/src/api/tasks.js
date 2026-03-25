import http from "./http";

export const fetchTasks = async () => {
  const { data } = await http.get("/tasks");
  return data;
};

export const createTask = async (payload) => {
  const { data } = await http.post("/tasks", payload);
  return data;
};

export const updateTask = async (id, payload) => {
  const { data } = await http.put(`/tasks/${id}`, payload);
  return data;
};

export const updateTaskStatus = async (id, payload) => {
  const { data } = await http.patch(`/tasks/${id}/status`, payload);
  return data;
};

export const deleteTask = async (id) => {
  const { data } = await http.delete(`/tasks/${id}`);
  return data;
};
