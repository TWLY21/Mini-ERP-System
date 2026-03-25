const pool = require("../db/pool");
const { createHttpError } = require("../utils/httpError");

const getAllDepartments = async () => {
  const result = await pool.query(
    "SELECT id, name, created_at FROM departments ORDER BY id ASC"
  );
  return result.rows;
};

const getDepartmentById = async (id) => {
  const result = await pool.query(
    "SELECT id, name, created_at FROM departments WHERE id = $1",
    [id]
  );
  const department = result.rows[0];

  if (!department) {
    throw createHttpError(404, "Department not found");
  }

  return department;
};

const createDepartment = async ({ name }) => {
  const result = await pool.query(
    `INSERT INTO departments (name)
     VALUES ($1)
     RETURNING id, name, created_at`,
    [name]
  );

  return result.rows[0];
};

const updateDepartment = async (id, { name }) => {
  const result = await pool.query(
    `UPDATE departments
     SET name = $1
     WHERE id = $2
     RETURNING id, name, created_at`,
    [name, id]
  );

  if (!result.rows[0]) {
    throw createHttpError(404, "Department not found");
  }

  return result.rows[0];
};

const deleteDepartment = async (id) => {
  const result = await pool.query(
    "DELETE FROM departments WHERE id = $1 RETURNING id",
    [id]
  );

  if (!result.rows[0]) {
    throw createHttpError(404, "Department not found");
  }

  return { message: "Department deleted successfully" };
};

module.exports = {
  getAllDepartments,
  getDepartmentById,
  createDepartment,
  updateDepartment,
  deleteDepartment,
};
