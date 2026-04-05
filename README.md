# Margmitra - Smart Delivery Scheduling App

Margmitra is a central platform for urban traffic congestion mitigation through intelligent delivery scheduling.

## Features
- AI-mocked Congestion Prediction
- Smart Slot Booking Interface
- User authentication (JWT, Cookies)
- Fleet Registration and Management
- Admin Dashboard capabilities

## Tech Stack
- Frontend: React JS, Vite, Recharts, Framer Motion
- Backend: Express JS, Node JS, MongoDB
- Auth: JWT embedded as strict an Http-only cookies

## Installation & Running Locally

1. Create a MongoDB instance (local or Cloud). Ensure it runs at `mongodb://localhost:27017/margmitra` or change `.env` in the server.

2. **Start Backend**:
```bash
cd server
npm install
npm run dev # start index.js with node or nodemon
```
Wait, let's configure `server/package.json` to have `dev: node src/index.js` quickly.

3. **Start Frontend**:
```bash
cd client
npm install
npm run dev
```

## Design Language
Follows a structured, human-centric aesthetic ignoring AI defaults: off-whites, neutral shadows, clear Inter font, and minimal accenting only for immediate CTAs.
