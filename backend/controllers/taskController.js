const taskService = require("../services/taskService");

const getTasks = async (req, res) => {
  const tasks = await taskService.getTasksByRole(req.user);
  res.json(tasks);
};

const getTask = async (req, res) => {
  const task = await taskService.getTaskById(Number(req.params.id), req.user);
  res.json(task);
};

const createTask = async (req, res) => {
  const task = await taskService.createTask({
    ...req.body,
    createdBy: req.user.id,
  });
  res.status(201).json(task);
};

const updateTask = async (req, res) => {
  const task = await taskService.updateTask(Number(req.params.id), req.body);
  res.json(task);
};

const updateTaskStatus = async (req, res) => {
  const task = await taskService.updateTaskStatus(
    Number(req.params.id),
    req.body,
    req.user
  );
  res.json(task);
};

const deleteTask = async (req, res) => {
  const result = await taskService.deleteTask(Number(req.params.id));
  res.json(result);
};

module.exports = {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
