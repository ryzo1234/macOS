import { Router } from 'express';
import { completeLesson, listLessons } from '../services/lessons.service.js';

const router = Router();

router.get('/', (req, res) => {
  const userId = (req.query.userId as string) ?? 'anonymous';
  res.json({ lessons: listLessons(userId) });
});

router.post('/complete', (req, res) => {
  const { userId, lessonId, wpm, accuracy } = req.body;
  if (!userId || !lessonId) return res.status(400).json({ error: 'userId and lessonId required' });
  completeLesson(userId, lessonId, wpm, accuracy);
  res.json({ status: 'ok' });
});

export default router;
