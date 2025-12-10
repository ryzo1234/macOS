import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

const Race = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [room, setRoom] = useState('public');
  const [text, setText] = useState('');
  const [input, setInput] = useState('');
  const [status, setStatus] = useState('Waiting for players...');
  const [opponentPrefix, setOpponentPrefix] = useState(0);

  useEffect(() => {
    const s = io('/race');
    setSocket(s);
    s.emit('join', { room, userId: 'guest' });
    s.on('start', ({ text: t }) => {
      setText(t);
      setStatus('Race started!');
    });
    s.on('opponent-progress', ({ prefix }) => setOpponentPrefix(prefix));
    s.on('finished', ({ userId }) => setStatus(`${userId} finished`));
    return () => s.disconnect();
  }, [room]);

  useEffect(() => {
    if (!socket) return;
    socket.emit('progress', { room, text, input });
  }, [input, socket, room, text]);

  const finish = () => {
    socket?.emit('finish', {
      room,
      payload: {
        userId: 'guest',
        modeType: 'time',
        modeValue: 60,
        category: 'words',
        language: 'en',
        text,
        input,
        durationMs: 60000
      }
    });
  };

  return (
    <main className="page">
      <h1>Race</h1>
      <p>{status}</p>
      <div className="controls">
        <label>Room code
          <input value={room} onChange={(e) => setRoom(e.target.value)} />
        </label>
      </div>
      <p className="test-text">
        {text.split('').map((c, idx) => (
          <span key={idx} className={idx < input.length ? (c === input[idx] ? 'correct' : 'incorrect') : 'pending'}>{c}</span>
        ))}
      </p>
      <textarea value={input} onChange={(e) => setInput(e.target.value)} rows={5} />
      <button className="btn primary" onClick={finish}>Finish</button>
      <p>Opponent progress: {opponentPrefix} chars</p>
    </main>
  );
};

export default Race;
