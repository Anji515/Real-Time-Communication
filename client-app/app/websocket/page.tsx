'use client';
import { useEffect, useRef, useState } from 'react';

export default function GamePage() {
  const [moves, setMoves] = useState<string[]>([]);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
  socketRef.current = new WebSocket("ws://localhost:4001");
  socketRef.current.onmessage = async (e) => {
    const text = await e.data.text();
    setMoves((prev) => [...prev, text]);
  };

  return () => socketRef.current?.close();
}, [])

  const sendMove = () => {
    const move = `Player moved at ${new Date().toLocaleTimeString()}`;
    socketRef.current?.send(move);
  };

  return (
    <div>
      <h2>Multiplayer Game</h2>
      <button onClick={sendMove}>Make Move</button>
      <ul>
        {moves.map((m, i) => (
          <li key={i}>{m}</li>
        ))}
      </ul>
    </div>
  );
}
