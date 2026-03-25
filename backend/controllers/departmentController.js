const departmentService = require("../services/departmentService");

const getDepartments = async (_req, res) => {
  const departments = await departmentService.getAllDepartments();
  res.json(departments);
};

const getDepartment = async (req, res) => {
  const department = await departmentService.getDepartmentById(
    Number(req.params.id)
  );
  res.json(department);
};

const createDepartment = async (req, res) => {
  const department = await departmentService.createDepartment(req.body);
  res.status(201).json(department);
};

const updateDepartment = async (req, res) => {
  const department = await departmentService.updateDepartment(
    Number(req.params.id),
    req.body
  );
  res.json(department);
};

const deleteDepartment = async (req, res) => {
  const result = await departmentService.deleteDepartment(Number(req.params.id));
  res.json(result);
};

module.exports = {
  getDepartments,
  getDepartment,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
