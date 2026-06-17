# Task Manager Monorepo

A full-stack task manager built with Expo React Native, Express, TypeScript, MongoDB, JWT authentication, and pnpm workspaces.

## Structure

```text
.
├── mobile
│   ├── app
│   ├── components
│   ├── services
│   ├── hooks
│   ├── store
│   └── package.json
└── server
    ├── src
    ├── package.json
    └── .env.example
```

## Install

```bash
pnpm install
```

## Run Locally

Start MongoDB locally or use MongoDB Atlas, then configure `server/.env`.

```bash
pnpm --filter server dev
pnpm --filter mobile start
```

The default mobile API URL is in `mobile/.env`:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000/api
```

For Android emulators, use `http://10.0.2.2:5000/api`. For a physical device, use your computer's LAN IP, such as `http://192.168.1.20:5000/api`.

## Server Environment

`server/.env`:

```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/tasks_manager
JWT_SECRET=development-secret-use-a-long-random-value-in-production
CLIENT_ORIGIN=*
```

Use a long random `JWT_SECRET` in production.

## Scripts

```bash
pnpm --filter mobile start
pnpm --filter server dev
pnpm --filter server build
pnpm --filter server start
pnpm typecheck
pnpm lint
```

## Railway Deployment

1. Push this monorepo to a Git provider.
2. Create a MongoDB Atlas cluster and copy the connection string.
3. Create a Railway project from the repository.
4. Set Railway's root directory to `server`.
5. Add environment variables in Railway:
   `PORT`, `MONGODB_URI`, `JWT_SECRET`, and optionally `CLIENT_ORIGIN`.
6. Use the build command `pnpm install --frozen-lockfile && pnpm build`.
7. Use the start command `pnpm start`.
8. Update `mobile/.env` so `EXPO_PUBLIC_API_URL` points to the deployed Railway API URL plus `/api`.

Railway will provide `process.env.PORT`; the server listens on that value.
