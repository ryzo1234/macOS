import { db } from '../db/db.js';

type Range = 'daily' | 'weekly' | 'all';

const rangeToSeconds: Record<Range, number> = {
  daily: 24 * 3600,
  weekly: 7 * 24 * 3600,
  all: 0
};

export const getLeaderboard = (range: Range, category?: string, modeType?: string, language?: string) => {
  const cutoff = range === 'all' ? 0 : Math.floor(Date.now() / 1000) - rangeToSeconds[range];
  let query = `SELECT user_id, MAX(wpm) as top_wpm, MAX(accuracy) as top_accuracy FROM results WHERE 1=1`;
  const params: any[] = [];
  if (cutoff > 0) {
    query += ' AND created_at >= ?';
    params.push(cutoff);
  }
  if (category) {
    query += ' AND category = ?';
    params.push(category);
  }
  if (modeType) {
    query += ' AND mode_type = ?';
    params.push(modeType);
  }
  if (language) {
    query += ' AND language = ?';
    params.push(language);
  }
  query += ' GROUP BY user_id ORDER BY top_wpm DESC LIMIT 20';
  return db.prepare(query).all(...params) as any[];
};
