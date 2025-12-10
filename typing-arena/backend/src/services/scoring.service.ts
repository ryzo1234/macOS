export type ScoreInput = {
  text: string;
  input: string;
  durationMs: number;
};

export const calculateScores = ({ text, input, durationMs }: ScoreInput) => {
  const expectedChars = text.split('');
  const inputChars = input.split('');
  const correct = expectedChars.filter((c, idx) => c === inputChars[idx]).length;
  const errors = Math.max(inputChars.length - correct, 0);
  const accuracy = expectedChars.length === 0 ? 0 : (correct / expectedChars.length) * 100;
  const wpm = (correct / 5) / (durationMs / 1000 / 60);
  const rawWpm = (inputChars.length / 5) / (durationMs / 1000 / 60);
  const consistency = accuracy - (errors / Math.max(expectedChars.length, 1)) * 100;
  return { wpm, rawWpm, accuracy, consistency, errors };
};
