# Task Manager API

Production-ready REST API for the Task Manager mobile app.

## Stack

- Node.js
- Express.js
- TypeScript
- MongoDB with Mongoose
- JWT authentication
- bcrypt password hashing
- dotenv, cors, helmet, express-validator

## Endpoints

```text
POST   /api/auth/register
POST   /api/auth/login
GET    /api/auth/me

GET    /api/tasks
POST   /api/tasks
GET    /api/tasks/:id
PUT    /api/tasks/:id
DELETE /api/tasks/:id
```

Private routes require:

```text
Authorization: Bearer <token>
```

## Local Development

```bash
pnpm install
pnpm --filter server dev
```

Configure `server/.env` before starting:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tasks_manager
JWT_SECRET=development-secret-use-a-long-random-value-in-production
CLIENT_ORIGIN=*
```

## Build

```bash
pnpm --filter server build
pnpm --filter server start
```

## Railway

Deploy with the Railway root directory set to `server`. Configure `MONGODB_URI` with MongoDB Atlas and use a strong `JWT_SECRET`. The server listens on `process.env.PORT`.
