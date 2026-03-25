# Mini ERP System

Production-style starter skeleton for an internal company ERP web application using:

- Frontend: Vue 3 + Vite + Vue Router + Pinia
- Backend: Node.js + Express
- Database: PostgreSQL
- Auth: JWT + bcrypt
- Authorization: RBAC for `admin`, `manager`, and `employee`

## Project Structure

```text
Playground/
|-- backend/
|   |-- config/
|   |-- controllers/
|   |-- db/
|   |-- middleware/
|   |-- routes/
|   |-- services/
|   |-- utils/
|   |-- .env.example
|   |-- app.js
|   |-- package.json
|   `-- server.js
|-- frontend/
|   |-- src/
|   |   |-- api/
|   |   |-- assets/
|   |   |-- components/
|   |   |-- router/
|   |   |-- store/
|   |   `-- views/
|   |-- .env.example
|   |-- index.html
|   |-- package.json
|   `-- vite.config.js
`-- README.md
```

## Backend Overview

- `backend/app.js`: Express app setup, middleware, and route mounting
- `backend/server.js`: server bootstrap and initial database ping
- `backend/db/schema.sql`: PostgreSQL schema for `users`, `departments`, and `tasks`
- `backend/controllers/*`: request/response handlers
- `backend/services/*`: business logic and database queries
- `backend/middleware/authenticate.js`: JWT verification
- `backend/middleware/authorize.js`: role-based route protection

## Frontend Overview

- `frontend/src/router/index.js`: protected routes with role checks
- `frontend/src/store/auth.js`: login state, token persistence, logout
- `frontend/src/api/*`: axios wrappers for backend endpoints
- `frontend/src/views/*`: starter screens for login, dashboard, users, departments, and tasks
- `frontend/src/components/AppLayout.vue`: shared shell and navigation

## Database Schema

Run the SQL in `backend/db/schema.sql` against your PostgreSQL database.

Tables included:

- `departments (id, name, created_at)`
- `users (id, name, email, password, role, department_id, created_at)`
- `tasks (id, title, description, assigned_to, created_by, status, created_at)`

## Example API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Users

- `GET /api/users/employees`
- `GET /api/users`
- `GET /api/users/:id`
- `POST /api/users`
- `PUT /api/users/:id`
- `DELETE /api/users/:id`

### Departments

- `GET /api/departments`
- `GET /api/departments/:id`
- `POST /api/departments`
- `PUT /api/departments/:id`
- `DELETE /api/departments/:id`

### Tasks

- `GET /api/tasks`
- `GET /api/tasks/:id`
- `POST /api/tasks`
- `PUT /api/tasks/:id`
- `PATCH /api/tasks/:id/status`
- `DELETE /api/tasks/:id`

## Role Permissions

- `admin`: full access to users, departments, and tasks
- `manager`: manage tasks and departments, and view employees for assignment
- `employee`: log in, view assigned tasks, and update their own task status

## Local Setup

### Backend

```bash
cd backend
npm install
copy .env.example .env
npm run seed:admin
node server.js
```

### Frontend

```bash
cd frontend
npm install
copy .env.example .env
npm run dev
```

### PostgreSQL

Create a database such as `mini_erp`, then execute:

```bash
psql -U postgres -d mini_erp -f backend/db/schema.sql
```

## Default Admin For Local Development

After the schema is created, run:

```bash
cd backend
npm run seed:admin
```

This creates or resets:

- Email: `admin@company.com`
- Password: `password123`

## Suggested Next Enhancements

- Request validation with `zod`, `joi`, or `express-validator`
- Database migrations with `knex`, `drizzle`, or `sequelize`
- Seed scripts for default admin and sample data
- Pagination, filtering, and search
- Audit logging and activity history
- Unit and integration tests
