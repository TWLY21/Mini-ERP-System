const userService = require("../services/userService");

const getUsers = async (_req, res) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

const getEmployees = async (_req, res) => {
  const users = await userService.getEmployees();
  res.json(users);
};

const getUser = async (req, res) => {
  const user = await userService.getUserById(Number(req.params.id));
  res.json(user);
};

const createUser = async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(201).json(user);
};

const updateUser = async (req, res) => {
  const user = await userService.updateUser(Number(req.params.id), req.body);
  res.json(user);
};

const deleteUser = async (req, res) => {
  const result = await userService.deleteUser(Number(req.params.id));
  res.json(result);
};

module.exports = {
  getUsers,
  getEmployees,
  getUser,
  createUser,
  updateUser,
  deleteUser,
};
