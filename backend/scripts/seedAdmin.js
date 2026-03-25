require("../config/env");

const bcrypt = require("bcryptjs");

const pool = require("../db/pool");

const seedAdmin = async () => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const departmentResult = await client.query(
      `INSERT INTO departments (name)
       VALUES ('Administration')
       ON CONFLICT (name) DO UPDATE SET name = EXCLUDED.name
       RETURNING id`
    );

    const departmentId = departmentResult.rows[0].id;
    const passwordHash = await bcrypt.hash("password123", 10);

    const userResult = await client.query(
      `INSERT INTO users (name, email, password, role, department_id)
       VALUES ($1, $2, $3, $4, $5)
       ON CONFLICT (email)
       DO UPDATE SET
         name = EXCLUDED.name,
         password = EXCLUDED.password,
         role = EXCLUDED.role,
         department_id = EXCLUDED.department_id
       RETURNING id, name, email, role, department_id, created_at`,
      [
        "System Admin",
        "admin@company.com",
        passwordHash,
        "admin",
        departmentId,
      ]
    );

    await client.query("COMMIT");

    console.log("Admin seed completed.");
    console.log("Email: admin@company.com");
    console.log("Password: password123");
    console.log("User:", userResult.rows[0]);
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to seed admin:", error.message);
    process.exitCode = 1;
  } finally {
    client.release();
    await pool.end();
  }
};

seedAdmin();
