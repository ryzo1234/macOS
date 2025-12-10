import { useEffect, useState } from 'react';
import { fetchTrainingPlan } from '../api/client';

const Training = () => {
  const [plan, setPlan] = useState<any[]>([]);
  useEffect(() => {
    const userId = localStorage.getItem('typing-arena-user') ?? 'guest';
    fetchTrainingPlan(userId).then(setPlan);
  }, []);

  return (
    <main className="page">
      <h1>Adaptive Training</h1>
      <p>Built from your latest performance to improve weak spots.</p>
      <div className="grid">
        {plan.map((m, idx) => (
          <div className="card" key={idx}>
            <h3>{m.title}</h3>
            <p>{m.focus}</p>
            <p>Repetitions: {m.repetitions}</p>
            <p>Targets: {m.targets.join(', ')}</p>
          </div>
        ))}
      </div>
    </main>
  );
};

export default Training;
