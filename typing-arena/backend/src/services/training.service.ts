import { db } from '../db/db.js';

type PlanModule = {
  title: string;
  focus: string;
  repetitions: number;
  targets: string[];
};

export const buildTrainingPlan = (userId: string): PlanModule[] => {
  const profile = db.prepare('SELECT weak_chars_json, weak_bigrams_json FROM training_profiles WHERE user_id = ?').get(userId) as any;
  const weakChars: string[] = profile?.weak_chars_json ? JSON.parse(profile.weak_chars_json) : ['e', 't', 'a'];
  const modules: PlanModule[] = [
    { title: 'Accuracy First', focus: 'steady pacing', repetitions: 3, targets: weakChars.slice(0, 3) },
    { title: 'Speed Intervals', focus: 'bursts then recovery', repetitions: 4, targets: ['words', 'quotes'] },
    { title: 'Weak Keys', focus: 'adaptive', repetitions: 3, targets: weakChars },
    { title: 'Word Drills', focus: 'core lexicon', repetitions: 3, targets: ['top100', 'random'] },
    { title: 'Numbers & Punctuation', focus: 'symbols', repetitions: 2, targets: ['numbers', 'punctuation'] }
  ];
  return modules;
};
