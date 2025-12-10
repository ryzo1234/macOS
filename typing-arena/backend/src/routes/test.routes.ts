import { Router } from 'express';
import { getRandomText } from '../services/text.service.js';
import { calculateScores } from '../services/scoring.service.js';
import { db } from '../db/db.js';
import { nanoid } from 'nanoid';

const router = Router();

router.get('/texts/random', (req, res) => {
  const text = getRandomText({
    category: req.query.category as string,
    language: req.query.language as string,
    modeType: req.query.modeType as 'time' | 'words',
    modeValue: Number(req.query.modeValue)
  });
  res.json({ text });
});

router.post('/results', (req, res) => {
  const { userId, modeType, modeValue, category, language, text, input, durationMs } = req.body;
  const scores = calculateScores({ text, input, durationMs });
  const id = nanoid();
  db.prepare(
    `INSERT INTO results (id, user_id, mode_type, mode_value, category, language, wpm, raw_wpm, accuracy, consistency, duration_ms, text_len, errors)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    userId,
    modeType,
    modeValue,
    category,
    language,
    scores.wpm,
    scores.rawWpm,
    scores.accuracy,
    scores.consistency,
    durationMs,
    text.length,
    scores.errors
  );
  res.json({ id, ...scores });
});

export default router;
