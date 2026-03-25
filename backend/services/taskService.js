const pool = require("../db/pool");
const { createHttpError } = require("../utils/httpError");

const taskSelect = `
  SELECT
    t.id,
    t.title,
    t.description,
    t.assigned_to,
    assignee.name AS assigned_to_name,
    t.created_by,
    creator.name AS created_by_name,
    t.status,
    t.created_at
  FROM tasks t
  LEFT JOIN users assignee ON assignee.id = t.assigned_to
  LEFT JOIN users creator ON creator.id = t.created_by
`;

const getTasksByRole = async (user) => {
  if (user.role === "employee") {
    const result = await pool.query(
      `${taskSelect} WHERE t.assigned_to = $1 ORDER BY t.id ASC`,
      [user.id]
    );
    return result.rows;
  }

  const result = await pool.query(`${taskSelect} ORDER BY t.id ASC`);
  return result.rows;
};

const getTaskById = async (id, user) => {
  const result = await pool.query(`${taskSelect} WHERE t.id = $1`, [id]);
  const task = result.rows[0];

  if (!task) {
    throw createHttpError(404, "Task not found");
  }

  if (user.role === "employee" && task.assigned_to !== user.id) {
    throw createHttpError(403, "You can only view your assigned tasks");
  }

  return task;
};

const createTask = async ({
  title,
  description = "",
  assignedTo = null,
  createdBy,
  status = "pending",
}) => {
  const result = await pool.query(
    `INSERT INTO tasks (title, description, assigned_to, created_by, status)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING id, title, description, assigned_to, created_by, status, created_at`,
    [title, description, assignedTo, createdBy, status]
  );

  return result.rows[0];
};

const updateTask = async (
  id,
  { title, description, assignedTo = null, status = "pending" }
) => {
  const result = await pool.query(
    `UPDATE tasks
     SET title = $1,
         description = $2,
         assigned_to = $3,
         status = $4
     WHERE id = $5
     RETURNING id, title, description, assigned_to, created_by, status, created_at`,
    [title, description, assignedTo, status, id]
  );

  if (!result.rows[0]) {
    throw createHttpError(404, "Task not found");
  }

  return result.rows[0];
};

const updateTaskStatus = async (id, { status }, user) => {
  const taskResult = await pool.query(
    "SELECT id, assigned_to FROM tasks WHERE id = $1",
    [id]
  );
  const task = taskResult.rows[0];

  if (!task) {
    throw createHttpError(404, "Task not found");
  }

  if (user.role === "employee" && task.assigned_to !== user.id) {
    throw createHttpError(403, "You can only update your own task status");
  }

  const result = await pool.query(
    `UPDATE tasks
     SET status = $1
     WHERE id = $2
     RETURNING id, title, description, assigned_to, created_by, status, created_at`,
    [status, id]
  );

  return result.rows[0];
};

const deleteTask = async (id) => {
  const result = await pool.query(
    "DELETE FROM tasks WHERE id = $1 RETURNING id",
    [id]
  );

  if (!result.rows[0]) {
    throw createHttpError(404, "Task not found");
  }

  return { message: "Task deleted successfully" };
};

module.exports = {
  getTasksByRole,
  getTaskById,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
};
