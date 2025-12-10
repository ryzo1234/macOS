import { Router } from 'express';
import { buildTrainingPlan } from '../services/training.service.js';

const router = Router();

router.get('/plan', (req, res) => {
  const userId = req.query.userId as string;
  if (!userId) return res.status(400).json({ error: 'userId required' });
  const plan = buildTrainingPlan(userId);
  res.json({ plan });
});

export default router;
