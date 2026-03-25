const jwt = require("jsonwebtoken");

const pool = require("../db/pool");
const { env } = require("../config/env");
const { createHttpError } = require("../utils/httpError");

const authenticate = async (req, _res, next) => {
  try {
    const authorization = req.headers.authorization || "";
    const [scheme, token] = authorization.split(" ");

    if (scheme !== "Bearer" || !token) {
      throw createHttpError(401, "Authentication required");
    }

    const decoded = jwt.verify(token, env.jwtSecret);
    const result = await pool.query(
      `SELECT id, name, email, role, department_id, created_at
       FROM users
       WHERE id = $1`,
      [decoded.userId]
    );

    if (!result.rows[0]) {
      throw createHttpError(401, "User not found");
    }

    req.user = result.rows[0];
    next();
  } catch (error) {
    next(createHttpError(401, error.message || "Invalid token"));
  }
};

module.exports = { authenticate };
