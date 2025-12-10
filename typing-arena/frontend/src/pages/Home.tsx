import { Link } from 'react-router-dom';

const Home = () => {
  const recent = JSON.parse(localStorage.getItem('typing-arena-recent') ?? '[]') as any[];
  return (
    <main className="page">
      <h1>Typing Arena</h1>
      <p>Advanced typing test, adaptive training, and real-time races.</p>
      <div className="actions">
        <Link to="/test" className="btn primary">Start Test</Link>
        <Link to="/train" className="btn">Start Training</Link>
        <Link to="/race" className="btn">Join Race</Link>
      </div>
      <section>
        <h2>Daily Challenge</h2>
        <p>Complete a 60s English words run with 95% accuracy.</p>
      </section>
      <section>
        <h2>Recent Results</h2>
        {recent.length === 0 && <p>No local results yet.</p>}
        <ul>
          {recent.map((r, idx) => (
            <li key={idx}>{r.wpm.toFixed(1)} WPM · {r.accuracy.toFixed(0)}% · {r.category}</li>
          ))}
        </ul>
      </section>
    </main>
  );
};

export default Home;
