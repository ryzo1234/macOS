import { createServer } from 'http';
import { Server } from 'socket.io';
import { createApp } from './app.js';
import { runMigrations } from './db/db.js';
import { registerRaceGateway } from './sockets/race.gateway.js';

const app = createApp();
const httpServer = createServer(app);
const io = new Server(httpServer, { cors: { origin: '*' } });

registerRaceGateway(io);

const port = process.env.PORT ? Number(process.env.PORT) : 3000;
runMigrations();
httpServer.listen(port, () => {
  console.log(`Typing Arena backend listening on ${port}`);
});
