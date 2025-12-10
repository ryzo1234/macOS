import { Router } from 'express';
import { getSummaryStats } from '../services/analytics.service.js';

const router = Router();

router.get('/summary', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  res.json(getSummaryStats(userId));
});

export default router;
