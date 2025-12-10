export const createTables = `
CREATE TABLE IF NOT EXISTS users (
  id TEXT PRIMARY KEY,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  display_name TEXT
);

CREATE TABLE IF NOT EXISTS results (
  id TEXT PRIMARY KEY,
  created_at INTEGER DEFAULT (strftime('%s','now')),
  user_id TEXT,
  mode_type TEXT,
  mode_value INTEGER,
  category TEXT,
  language TEXT,
  wpm REAL,
  raw_wpm REAL,
  accuracy REAL,
  consistency REAL,
  duration_ms INTEGER,
  text_len INTEGER,
  errors INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS training_profiles (
  user_id TEXT PRIMARY KEY,
  updated_at INTEGER,
  weak_chars_json TEXT,
  weak_bigrams_json TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE IF NOT EXISTS lesson_progress (
  user_id TEXT,
  lesson_id TEXT,
  status TEXT,
  best_wpm REAL,
  best_accuracy REAL,
  updated_at INTEGER,
  PRIMARY KEY (user_id, lesson_id),
  FOREIGN KEY (user_id) REFERENCES users(id)
);
`;
