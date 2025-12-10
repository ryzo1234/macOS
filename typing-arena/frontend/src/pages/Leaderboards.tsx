import { useEffect, useState } from 'react';
import { fetchLeaderboards } from '../api/client';

const Leaderboards = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [range, setRange] = useState('daily');

  useEffect(() => {
    fetchLeaderboards({ range }).then(setRows);
  }, [range]);

  return (
    <main className="page">
      <h1>Leaderboards</h1>
      <label>Range
        <select value={range} onChange={(e) => setRange(e.target.value)}>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="all">All-Time</option>
        </select>
      </label>
      <table className="table">
        <thead>
          <tr><th>User</th><th>WPM</th><th>Accuracy</th></tr>
        </thead>
        <tbody>
          {rows.map((r, idx) => (
            <tr key={idx}>
              <td>{r.user_id}</td>
              <td>{Number(r.top_wpm).toFixed(1)}</td>
              <td>{Number(r.top_accuracy).toFixed(1)}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </main>
  );
};

export default Leaderboards;
