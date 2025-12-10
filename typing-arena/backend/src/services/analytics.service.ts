import { db } from '../db/db.js';

export const getSummaryStats = (userId: string) => {
  const sevenDaysAgo = Math.floor(Date.now() / 1000) - 7 * 24 * 3600;
  const stmt = db.prepare(
    `SELECT created_at, wpm, accuracy, mode_type, mode_value, category, language FROM results
     WHERE user_id = ? AND created_at >= ? ORDER BY created_at DESC`
  );
  const rows = stmt.all(userId, sevenDaysAgo) as any[];
  const best = db
    .prepare(
      `SELECT MAX(wpm) as best_wpm, MAX(accuracy) as best_accuracy FROM results WHERE user_id = ?`
    )
    .get(userId) as any;
  const mistakes = db
    .prepare(
      `SELECT category, COUNT(*) as count FROM results WHERE user_id = ? GROUP BY category ORDER BY count DESC LIMIT 5`
    )
    .all(userId) as any[];
  return {
    recent: rows,
    best,
    mistakes
  };
};
