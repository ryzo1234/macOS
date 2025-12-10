import express from 'express';
import cors from 'cors';
import testRoutes from './routes/test.routes.js';
import trainingRoutes from './routes/training.routes.js';
import lessonsRoutes from './routes/lessons.routes.js';
import statsRoutes from './routes/stats.routes.js';
import leaderboardRoutes from './routes/leaderboard.routes.js';

export const createApp = () => {
  const app = express();
  app.use(cors());
  app.use(express.json());

  app.use('/api', testRoutes);
  app.use('/api/training', trainingRoutes);
  app.use('/api/lessons', lessonsRoutes);
  app.use('/api/stats', statsRoutes);
  app.use('/api/leaderboards', leaderboardRoutes);

  app.get('/health', (_req, res) => res.json({ status: 'ok' }));
  return app;
};
