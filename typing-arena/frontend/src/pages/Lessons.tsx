import { useEffect, useState } from 'react';
import { fetchLessons } from '../api/client';

const Lessons = () => {
  const [lessons, setLessons] = useState<any[]>([]);
  useEffect(() => {
    const userId = localStorage.getItem('typing-arena-user') ?? 'guest';
    fetchLessons(userId).then((res) => setLessons(res));
  }, []);

  return (
    <main className="page">
      <h1>Lessons</h1>
      <div className="grid">
        {lessons.map((l) => (
          <div className="card" key={l.id}>
            <h3>{l.title}</h3>
            <p>{l.description}</p>
            <p>Requirements: {l.requiredWpm} WPM @ {l.requiredAccuracy}% accuracy</p>
            <p>Status: {l.status}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Lessons;
