import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';
import { createTables } from './schema.js';

const dataDir = path.resolve(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}
const dbPath = path.join(dataDir, 'typing-arena.sqlite');

export const db = new Database(dbPath);

export const runMigrations = () => {
  db.exec(createTables);
};
