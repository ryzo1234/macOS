# Typing Arena

Production-ready monorepo for Typing Arena: typing tests, adaptive training, and real-time online races.

## Stack
- Frontend: React + Vite + TypeScript + React Router
- Backend: Node.js + Express + TypeScript
- Real-time: Socket.io namespace `/race`
- Database: SQLite via better-sqlite3

## Project Structure
```
typing-arena/
  backend/               # Express API + Socket.io
  frontend/              # React SPA
  nginx/typing-arena.conf# Nginx reverse proxy (includes WebSockets)
  systemd/typing-arena-backend.service
```

### Backend
- Clean architecture: routes -> services -> db
- Simple migration runner in `src/db/migrations.ts` invoked at startup.

### Frontend
- SPA with routes for Home, Test, Training, Lessons, Race, Stats, Leaderboards, Settings.

## Local Development
1. **Install dependencies**
```bash
cd backend
npm install
npm run dev
```
In another terminal:
```bash
cd frontend
npm install
npm run dev
```
Frontend dev server proxies `/api` to `http://localhost:3000`.

## Production Build
```bash
cd backend
npm install
npm run build
node dist/db/migrations.js
node dist/index.js
```
For frontend:
```bash
cd frontend
npm install
npm run build
# Deploy the contents of frontend/dist to a static host or Nginx root
```

## VPS Deployment (Ubuntu 24.04 + Nginx)
```bash
sudo apt update && sudo apt install -y nodejs npm nginx sqlite3
# Create project dir
sudo mkdir -p /var/www/typing-arena
sudo cp -r backend frontend /var/www/typing-arena/
cd /var/www/typing-arena/backend
npm install --production
npm run build
node dist/db/migrations.js
```

### systemd
Copy service file and enable:
```bash
sudo cp systemd/typing-arena-backend.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable --now typing-arena-backend
```

### Nginx
```bash
sudo cp nginx/typing-arena.conf /etc/nginx/sites-available/typing-arena.conf
sudo ln -s /etc/nginx/sites-available/typing-arena.conf /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```
- Serve frontend build from `/var/www/typing-arena/frontend/dist` (update `root` directive accordingly).
- WebSockets for Socket.io are proxied in `/socket.io` and `/race` locations.

### Environment Notes
- Backend listens on port `3000` by default (`PORT` env var supported).
- Database file stored in `/var/www/typing-arena/backend/data/typing-arena.sqlite`.

## API Overview
- `GET /api/texts/random?category=&language=&modeType=&modeValue=`
- `POST /api/results`
- `GET /api/stats/summary?userId=`
- `GET /api/leaderboards?range=daily|weekly|all&category=&modeType=&language=`
- `GET /api/training/plan?userId=`
- `GET /api/lessons`
- `POST /api/lessons/complete`

## Socket.io Race Flow
- Namespace: `/race`
- Events: `join` (room code), `start` (text + countdown), `progress` (prefix broadcast), `finish` (server validates & stores).
