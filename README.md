# Tripify

A simple trip planner and tracker. Type where you're starting from, where you're
going, and a date — Tripify shows you the route on a map along with the distance
and travel time, and lets you save it to a personal dashboard to track later.

## Features

- Email/password authentication (JWT based)
- Trip planner with live Google Maps route, distance and duration
- Trip tracker dashboard - save trips, mark them planned/completed, delete them
- Home page destination grid that pulls from MongoDB - add more places to the
  database and the grid grows on its own, no frontend changes needed
- Light and dark mode, saved to your browser

## Tech stack

**Client:** React (Vite), React Router, Axios, `@react-google-maps/api`, plain CSS
**Server:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcrypt.js

## Project structure

```
tripify/
├── client/      React frontend (deploy to Vercel)
└── server/      Express API (deploy to Render)
```

Each folder is independent — its own `package.json`, its own `node_modules`,
its own deployment. The client talks to the server purely over the REST API
defined under `/api`.

## Running it locally

### 1. Server

```
cd server
npm install
cp .env.example .env   # then fill in your own values
npm run dev
```

The server needs three things in `.env`:

| Variable      | What it's for                                              |
|---------------|-------------------------------------------------------------|
| `MONGO_URI`   | Your MongoDB connection string (Atlas free tier works fine) |
| `JWT_SECRET`  | Any long random string, used to sign login tokens            |
| `CLIENT_URL`  | The URL your frontend runs on, for CORS                       |

Want some sample destinations on the home page right away?

```
npm run seed
```

This drops a few sample places into your database. Feel free to edit
`server/seed/places.js` or just add your own places by sending a `POST`
request to `/api/places` (it's a protected route, so log in first and use
the token).

### 2. Client

```
cd client
npm install
cp .env.example .env   # then fill in your own values
npm run dev
```

The client needs two things in `.env`:

| Variable                   | What it's for                                  |
|-----------------------------|-------------------------------------------------|
| `VITE_API_BASE_URL`        | Where your server is running, e.g. `http://localhost:5000/api` |
| `VITE_GOOGLE_MAPS_API_KEY` | A Google Maps API key (see below)               |

The app will be running at `http://localhost:5173`.

### Getting a Google Maps API key

1. Go to the [Google Cloud Console](https://console.cloud.google.com/google/maps-apis)
2. Create a project (or use an existing one)
3. Enable **Maps JavaScript API** and **Directions API**
4. Create an API key under "Credentials"
5. Paste it into `VITE_GOOGLE_MAPS_API_KEY` in `client/.env`

Google gives a generous free monthly usage tier, which is more than enough
for a personal project.

## Deploying

### Server → Render

1. Push this repo to GitHub
2. On Render, create a **New Web Service** and point it at your repo
3. Set the **Root Directory** to `server`
4. Build command: `npm install`
5. Start command: `npm start`
6. Add the same environment variables from `server/.env.example` under the
   "Environment" tab (use your real values, and set `CLIENT_URL` to your
   Vercel URL once you have it)

### Client → Vercel

1. On Vercel, create a **New Project** and point it at your repo
2. Set the **Root Directory** to `client`
3. Framework preset: Vite (Vercel usually detects this automatically)
4. Add the environment variables from `client/.env.example` under
   Project Settings → Environment Variables (point `VITE_API_BASE_URL` at
   your live Render URL, e.g. `https://tripify-server.onrender.com/api`)
5. Deploy

The included `vercel.json` makes sure routes like `/dashboard` or `/planner`
still work correctly when someone refreshes the page directly on them.

One last step: once both are deployed, update `CLIENT_URL` on Render to your
real Vercel URL so CORS allows the request through.

## A note on the free tiers

Render's free web services spin down after periods of inactivity and take a
few seconds to wake back up on the next request — that's normal, not a bug.
