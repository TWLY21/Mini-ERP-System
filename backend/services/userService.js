const bcrypt = require("bcryptjs");

const pool = require("../db/pool");
const { createHttpError } = require("../utils/httpError");

const baseUserSelect = `
  SELECT
    u.id,
    u.name,
    u.email,
    u.role,
    u.department_id,
    d.name AS department_name,
    u.created_at
  FROM users u
  LEFT JOIN departments d ON d.id = u.department_id
`;

const getAllUsers = async () => {
  const result = await pool.query(`${baseUserSelect} ORDER BY u.id ASC`);
  return result.rows;
};

const getEmployees = async () => {
  const result = await pool.query(
    `${baseUserSelect} WHERE u.role = 'employee' ORDER BY u.id ASC`
  );
  return result.rows;
};

const getUserById = async (id) => {
  const result = await pool.query(`${baseUserSelect} WHERE u.id = $1`, [id]);
  const user = result.rows[0];

  if (!user) {
    throw createHttpError(404, "User not found");
  }

  return user;
};

const createUser = async ({ name, email, password, role, departmentId = null }) => {
  const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  if (existingUser.rows[0]) {
    throw createHttpError(409, "Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, department_id)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, name, email, role, department_id, created_at`,
    [name, email, hashedPassword, role, departmentId]
  );

  return result.rows[0];
};

const updateUser = async (id, { name, email, password, role, departmentId }) => {
  const currentUserResult = await pool.query(
    "SELECT id, password FROM users WHERE id = $1",
    [id]
  );
  const currentUser = currentUserResult.rows[0];

  if (!currentUser) {
    throw createHttpError(404, "User not found");
  }

  const existingUser = await pool.query(
    "SELECT id FROM users WHERE email = $1 AND id <> $2",
    [email, id]
  );

  if (existingUser.rows[0]) {
    throw createHttpError(409, "Email is already in use");
  }

  const hashedPassword = password
    ? await bcrypt.hash(password, 10)
    : currentUser.password;

  const result = await pool.query(
    `UPDATE users
     SET name = $1,
         email = $2,
         password = $3,
         role = $4,
         department_id = $5
     WHERE id = $6
     RETURNING id, name, email, role, department_id, created_at`,
    [name, email, hashedPassword, role, departmentId, id]
  );

  return result.rows[0];
};

const deleteUser = async (id) => {
  const result = await pool.query(
    "DELETE FROM users WHERE id = $1 RETURNING id",
    [id]
  );

  if (!result.rows[0]) {
    throw createHttpError(404, "User not found");
  }

  return { message: "User deleted successfully" };
};

module.exports = {
  getAllUsers,
  getEmployees,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
};
