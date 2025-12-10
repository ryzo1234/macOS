import { useEffect, useState } from 'react';
import { fetchStats } from '../api/client';

const Stats = () => {
  const [summary, setSummary] = useState<any | null>(null);

  useEffect(() => {
    const userId = localStorage.getItem('typing-arena-user') ?? 'guest';
    fetchStats(userId).then(setSummary);
  }, []);

  if (!summary) return <main className="page"><p>Loading...</p></main>;

  return (
    <main className="page">
      <h1>Stats</h1>
      <section className="card">
        <h3>Best Records</h3>
        <p>WPM: {summary.best?.best_wpm ?? 0}</p>
        <p>Accuracy: {summary.best?.best_accuracy ?? 0}%</p>
      </section>
      <section>
        <h3>Recent 7 Days</h3>
        <ul>
          {summary.recent.map((r: any, idx: number) => (
            <li key={idx}>{new Date(r.created_at * 1000).toLocaleString()} — {r.wpm.toFixed(1)} WPM ({r.accuracy.toFixed(1)}%)</li>
          ))}
        </ul>
      </section>
      <section>
        <h3>Top Mistakes</h3>
        <ul>
          {summary.mistakes.map((m: any, idx: number) => (
            <li key={idx}>{m.category}: {m.count}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Stats;
