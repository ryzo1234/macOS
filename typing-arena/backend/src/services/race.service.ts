import { db } from '../db/db.js';
import { calculateScores } from './scoring.service.js';
import { nanoid } from 'nanoid';

export const validateRaceInput = (text: string, input: string) => {
  let prefix = 0;
  const max = Math.min(text.length, input.length);
  for (let i = 0; i < max; i++) {
    if (text[i] !== input[i]) break;
    prefix++;
  }
  return prefix;
};

export const persistRaceResult = (
  userId: string,
  modeType: string,
  modeValue: number,
  category: string,
  language: string,
  text: string,
  input: string,
  durationMs: number
) => {
  const { wpm, rawWpm, accuracy, consistency, errors } = calculateScores({ text, input, durationMs });
  const id = nanoid();
  db.prepare(
    `INSERT INTO results (id, user_id, mode_type, mode_value, category, language, wpm, raw_wpm, accuracy, consistency, duration_ms, text_len, errors)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(id, userId, modeType, modeValue, category, language, wpm, rawWpm, accuracy, consistency, durationMs, text.length, errors);
  return { id, wpm, rawWpm, accuracy, consistency, errors };
};
