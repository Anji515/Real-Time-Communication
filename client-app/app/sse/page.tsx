"use client";
import { useEffect, useState } from "react";

export default function ScorePage() {
  const [updates, setUpdates] = useState<string[]>([]);

  useEffect(() => {
    const source = new EventSource("http://localhost:4002/sse");
    source.onmessage = (e) => setUpdates((prev) => [...prev, e.data]);

    return () => source.close();
  }, []);

  return (
    <div>
      <h2>Live Scores</h2>
      <ul>
        {updates.map((u, i) => (
          <li key={i}>{u}</li>
        ))}
      </ul>
    </div>
  );
}
