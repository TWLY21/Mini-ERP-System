const bcrypt = require("bcryptjs");

const pool = require("../db/pool");
const { signToken } = require("../utils/jwt");
const { createHttpError } = require("../utils/httpError");

const buildAuthPayload = (user) => ({
  token: signToken({ userId: user.id, role: user.role }),
  user,
});

const register = async ({ name, email, password, departmentId = null }) => {
  const existingUser = await pool.query("SELECT id FROM users WHERE email = $1", [
    email,
  ]);

  if (existingUser.rows[0]) {
    throw createHttpError(409, "Email is already in use");
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const result = await pool.query(
    `INSERT INTO users (name, email, password, role, department_id)
     VALUES ($1, $2, $3, 'employee', $4)
     RETURNING id, name, email, role, department_id, created_at`,
    [name, email, hashedPassword, departmentId]
  );

  return buildAuthPayload(result.rows[0]);
};

const login = async ({ email, password }) => {
  const result = await pool.query(
    `SELECT id, name, email, password, role, department_id, created_at
     FROM users
     WHERE email = $1`,
    [email]
  );

  const user = result.rows[0];
  if (!user) {
    throw createHttpError(401, "Invalid email or password");
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    throw createHttpError(401, "Invalid email or password");
  }

  const { password: _password, ...safeUser } = user;
  return buildAuthPayload(safeUser);
};

module.exports = {
  register,
  login,
};
