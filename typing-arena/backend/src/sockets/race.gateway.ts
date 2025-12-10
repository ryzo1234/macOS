import { Server } from 'socket.io';
import { getRandomText } from '../services/text.service.js';
import { persistRaceResult, validateRaceInput } from '../services/race.service.js';

export const registerRaceGateway = (io: Server) => {
  const lobby = io.of('/race');

  lobby.on('connection', (socket) => {
    socket.on('join', ({ room, userId }) => {
      socket.join(room);
      const clients = lobby.adapter.rooms.get(room)?.size ?? 0;
      socket.to(room).emit('system', `${userId ?? 'guest'} joined`);
      if (clients === 1) {
        const text = getRandomText({ category: 'words', language: 'en' });
        lobby.to(room).emit('start', { text, countdown: 3 });
      }
    });

    socket.on('progress', ({ room, text, input }) => {
      const prefix = validateRaceInput(text, input);
      socket.to(room).emit('opponent-progress', { prefix, length: input.length });
    });

    socket.on('finish', ({ room, payload }) => {
      const { userId, modeType, modeValue, category, language, text, input, durationMs } = payload;
      const scores = persistRaceResult(userId, modeType, modeValue, category, language, text, input, durationMs);
      lobby.to(room).emit('finished', { userId, scores });
    });
  });
};
