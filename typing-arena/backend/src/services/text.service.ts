import fs from 'fs';
import path from 'path';

type ModeType = 'time' | 'words';

type TextRequest = {
  category?: string;
  language?: string;
  modeType?: ModeType;
  modeValue?: number;
};

const dataDir = path.resolve(process.cwd(), 'data', 'texts');

export const getRandomText = (params: TextRequest): string => {
  const { category = 'words', language = 'en' } = params;
  const fileMap: Record<string, string> = {
    words: `${language}_words_1k.json`,
    quotes: `${language}_quotes.json`,
    punctuation: 'punctuation_sets.json',
    numbers: 'numbers_sets.json',
    code: 'code_snippets.json'
  };

  const fileName = fileMap[category] ?? fileMap.words;
  const filePath = path.join(dataDir, fileName);
  if (!fs.existsSync(filePath)) {
    return 'Typing Arena placeholder text';
  }
  const data = JSON.parse(fs.readFileSync(filePath, 'utf-8')) as string[];
  return data[Math.floor(Math.random() * data.length)];
};
