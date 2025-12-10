import { useEffect, useState } from 'react';
import { fetchRandomText, postResult } from '../api/client';

const modes = [15, 30, 60, 120];

const Test = () => {
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [duration, setDuration] = useState(60);
  const [category, setCategory] = useState('words');
  const [language, setLanguage] = useState('en');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [completed, setCompleted] = useState<any | null>(null);

  useEffect(() => {
    fetchRandomText({ category, language }).then(setText);
  }, [category, language]);

  const handleInput = (value: string) => {
    if (!startTime) setStartTime(Date.now());
    setInput(value);
  };

  const finish = async () => {
    if (!startTime) return;
    const durationMs = Date.now() - startTime;
    const payload = {
      userId: localStorage.getItem('typing-arena-user') ?? 'guest',
      modeType: 'time',
      modeValue: duration,
      category,
      language,
      text,
      input,
      durationMs
    };
    const res = await postResult(payload);
    setCompleted(res);
    const recent = JSON.parse(localStorage.getItem('typing-arena-recent') ?? '[]');
    recent.unshift(res);
    localStorage.setItem('typing-arena-recent', JSON.stringify(recent.slice(0, 5)));
  };

  return (
    <main className="page">
      <h1>Typing Test</h1>
      <div className="controls">
        <label>Mode
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            {modes.map((m) => <option key={m}>{m}</option>)}
          </select>
        </label>
        <label>Category
          <select value={category} onChange={(e) => setCategory(e.target.value)}>
            <option value="words">Words</option>
            <option value="quotes">Quotes</option>
            <option value="punctuation">Punctuation</option>
            <option value="numbers">Numbers</option>
            <option value="code">Code</option>
          </select>
        </label>
        <label>Language
          <select value={language} onChange={(e) => setLanguage(e.target.value)}>
            <option value="en">EN</option>
            <option value="pl">PL</option>
          </select>
        </label>
        <button className="btn" onClick={() => fetchRandomText({ category, language }).then(setText)}>New Text</button>
      </div>
      <p className="test-text">
        {text.split('').map((char, idx) => {
          const typed = input[idx];
          let cls = '';
          if (typed === undefined) cls = 'pending';
          else if (typed === char) cls = 'correct';
          else cls = 'incorrect';
          return <span key={idx} className={cls}>{char}</span>;
        })}
      </p>
      <textarea
        value={input}
        onChange={(e) => handleInput(e.target.value)}
        rows={6}
        placeholder="Start typing here"
      />
      <div className="actions">
        <button className="btn primary" onClick={finish}>Finish</button>
      </div>
      {completed && (
        <div className="card">
          <h3>Results</h3>
          <p>WPM: {completed.wpm.toFixed(1)} | Raw: {completed.rawWpm.toFixed(1)} | Accuracy: {completed.accuracy.toFixed(1)}%</p>
        </div>
      )}
    </main>
  );
};

export default Test;
