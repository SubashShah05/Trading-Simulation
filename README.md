# TradeSim Pro - Real-Time Trading Simulation Platform

Minimal full-stack trading simulator with secure auth, live stock updates, favorites, and virtual portfolio execution.

## Live Demo
- Frontend: Add your Vercel/Netlify URL
- Backend: Add your Render/Railway URL

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, React Router
- **Backend:** Node.js, Express, Socket.io
- **Database:** MongoDB Atlas (or local MongoDB)
- **Auth:** JWT + bcrypt
- **Security:** Helmet, CORS, rate limiting

## Features
- Minimalist landing page with dark mode, sticky navbar, smooth scroll
- Live stock dashboard with search, detail view, loading/error states
- JWT auth: signup/login/protected routes
- Favorites API with instant frontend sync + localStorage fallback
- Real-time stock updates through Socket.io (polling fallback included)
- Trading simulation:
  - Virtual wallet ($10,000 initial balance)
  - Buy/Sell orders with locked execution price
  - Portfolio metrics: cash, invested amount, total balance, P/L
  - Transaction history model + duplicate request prevention (`requestId`)
- Production-ready backend middlewares and global error handler
- Lazy-loaded frontend routes

## Folder Structure
```
trading-simulato/
  client/     # React frontend
  server/     # Express + Mongo backend
```

## Environment Variables
Copy `server/.env.example` to `server/.env` and fill values:

- `PORT=5000`
- `MONGO_URI=<mongodb-atlas-uri>`
- `JWT_SECRET=<strong-secret>`
- `CLIENT_ORIGIN=http://localhost:5173`
- `ALPHA_VANTAGE_API_KEY=` (optional)
- `FINNHUB_API_KEY=` (optional)

Optional frontend variable (`client/.env`):
- `VITE_API_URL=http://localhost:5000`

## Local Setup
1. Install dependencies:
   - `npm install`
   - `npm install --prefix server`
   - `npm install --prefix client`
2. Start app (both frontend + backend):
   - `npm run dev`
3. Open:
   - Frontend: `http://localhost:5173`
   - Backend health: `http://localhost:5000/api/health`

## API Overview
- `POST /api/auth/signup`
- `POST /api/auth/login`
- `GET /api/auth/me` (protected)
- `GET /api/stocks`
- `GET /api/stocks/:symbol`
- `GET /api/favorites` (protected)
- `POST /api/favorites` (protected)
- `DELETE /api/favorites/:id` (protected)
- `GET /api/trading/portfolio` (protected)
- `POST /api/trading/orders` (protected)
- `GET /api/trading/transactions` (protected)

## Deployment Guide
### Frontend (Vercel/Netlify)
- Build command: `npm run build --prefix client`
- Publish directory: `client/dist`
- Set `VITE_API_URL` to your backend URL

### Backend (Render/Railway)
- Start command: `npm run start --prefix server`
- Add all variables from `server/.env.example`
- Ensure MongoDB Atlas network allows deployment IPs

### MongoDB Atlas
- Create free cluster
- Create database user
- Set `MONGO_URI` in backend service

## System Design Thinking
### 1) Market Data Engine
- Price engine keeps an in-memory market map and updates every 10 seconds.
- Each tick applies gradual random variation (approx. +/-1% to +/-3%) and broadcasts via Socket.io.

### 2) Trading Consistency
- Orders use MongoDB transactions (`session.startTransaction`) for wallet + holdings + transaction writes.
- Prevent duplicate submissions using unique `(user, requestId)`.
- Validation enforces:
  - no negative wallet balance
  - cannot sell more quantity than owned

### 3) Real-Time Sync
- All clients receive `stocks:update` events.
- User-specific events (`order:created`) are emitted to user room to refresh portfolio quickly.

### 4) Security & Reliability
- Passwords hashed with bcrypt
- JWT protected APIs
- Helmet + CORS + rate limiting + global error middleware

## Bonus Extensions
- Leaderboard endpoint exists (`GET /api/trading/leaderboard`)
- Add charting (portfolio history) with Recharts/ApexCharts
- Add keyboard shortcuts (buy/sell modal open, quick symbol search)
- Replace mock engine with Finnhub/Alpha Vantage integration fallback

## Notes
- Current implementation includes a deterministic mock market engine for stable development.
- If external stock APIs fail, simulation still runs from internal price engine.
