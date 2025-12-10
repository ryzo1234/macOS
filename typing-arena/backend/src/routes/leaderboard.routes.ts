import { Router } from 'express';
import { getLeaderboard } from '../services/leaderboard.service.js';

const router = Router();

router.get('/', (req, res) => {
  const range = (req.query.range as 'daily' | 'weekly' | 'all') ?? 'daily';
  const { category, modeType, language } = req.query as Record<string, string>;
  const rows = getLeaderboard(range, category, modeType, language);
  res.json({ leaderboard: rows });
});

export default router;
