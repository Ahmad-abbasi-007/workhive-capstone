# WorkHive - Freelance Marketplace

WorkHive is a full-stack freelance marketplace. Clients can post projects and hire freelancers; freelancers can bid, message clients after hiring, and leave reviews.

## Stack

- Frontend: React, Vite, Tailwind CSS
- API: Node.js, Express, MongoDB, JWT
- Tests: Vitest/React Testing Library and Jest/Supertest

## Deploy

The frontend is deployed to Vercel and the API to Render. The frontend needs the API's public base URL at build time.

### 1. Deploy the API to Render

1. Create a MongoDB database and copy its connection string.
2. In Render, create a Blueprint from this repository and apply the settings in [`render.yaml`](./render.yaml).
3. Set `MONGO_URI` to the MongoDB connection string in the Render service environment. Render generates `JWT_SECRET` for the service.
4. Wait for the service health check at `/api/health` to pass and copy the service URL, for example `https://workhive-api.onrender.com`.

### 2. Deploy the frontend to Vercel

1. Import this repository into Vercel.
2. Set the project **Root Directory** to `client`.
3. Set the environment variable `VITE_API_URL` to the Render service URL, without a trailing slash or `/api` suffix.
4. Deploy. The Vercel rewrite in [`client/vercel.json`](./client/vercel.json) supports direct visits to React Router pages.

Set `VITE_API_URL` for each Vercel environment (Production, Preview, and Development) as needed. Since Vite embeds this value during build, redeploy after changing it.

## Local development

Requirements: Node.js 20 and a reachable MongoDB instance.

1. Copy `server/.env.example` to `server/.env` and set `MONGO_URI` and a private `JWT_SECRET`.
2. In one terminal, run `cd server`, `npm install`, then `npm start`.
3. In another terminal, run `cd client`, `npm install`, then `npm run dev`.

The client defaults to `http://localhost:5000` for its API during local development. Override this with `client/.env.local` if needed.

## Tests and build

- Frontend tests: `cd client` then `npm test -- --run`
- Frontend production build: `cd client` then `npm run build`
- Backend tests: `cd server` then `npm test`
