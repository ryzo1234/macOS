import { db } from '../db/db.js';

export type Lesson = {
  id: string;
  title: string;
  description: string;
  requiredAccuracy: number;
  requiredWpm: number;
};

const lessons: Lesson[] = [
  { id: 'lesson-1', title: 'Home Row', description: 'Master ASDF JKL;', requiredAccuracy: 90, requiredWpm: 35 },
  { id: 'lesson-2', title: 'Top Row', description: 'QWERTY reach', requiredAccuracy: 92, requiredWpm: 40 },
  { id: 'lesson-3', title: 'Numbers & Symbols', description: 'Numbers and punctuation', requiredAccuracy: 92, requiredWpm: 45 }
];

export const listLessons = (userId: string) => {
  const progress = db.prepare('SELECT * FROM lesson_progress WHERE user_id = ?').all(userId) as any[];
  return lessons.map((lesson) => {
    const entry = progress.find((p) => p.lesson_id === lesson.id);
    return { ...lesson, status: entry?.status ?? 'locked', best_wpm: entry?.best_wpm ?? 0, best_accuracy: entry?.best_accuracy ?? 0 };
  });
};

export const completeLesson = (userId: string, lessonId: string, wpm: number, accuracy: number) => {
  db.prepare(
    `INSERT INTO lesson_progress (user_id, lesson_id, status, best_wpm, best_accuracy, updated_at)
     VALUES (?, ?, 'completed', ?, ?, strftime('%s','now'))
     ON CONFLICT(user_id, lesson_id) DO UPDATE SET status='completed', best_wpm=excluded.best_wpm, best_accuracy=excluded.best_accuracy, updated_at=excluded.updated_at`
  ).run(userId, lessonId, wpm, accuracy);
};
