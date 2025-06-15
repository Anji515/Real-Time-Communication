"use client";
import { useEffect, useState } from "react";

export default function ScorePage() {
  const [updates, setUpdates] = useState<string[]>([]);

  useEffect(() => {
    const source = new EventSource("http://localhost:4002/sse");
    source.onmessage = (e) => setUpdates((prev) => [e.data, ...prev]);

    return () => source.close();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center p-6">
      <div className="w-full max-w-xl">
        <h2 className="text-3xl font-bold text-center mb-6 text-blue-700">
          🏏 Live Cricket Score Updates
        </h2>

        <div className="bg-white shadow-lg rounded-lg p-4 border border-blue-200">
          {updates.length === 0 ? (
            <p className="text-gray-500 text-center">Waiting for updates...</p>
          ) : (
            <ul className="divide-y divide-blue-100 max-h-[400px] overflow-y-auto">
              {updates.map((u, i) => (
                <li key={i} className="py-3">
                  <div className="text-base font-medium text-gray-800">{u}</div>
                  <div className="text-sm text-gray-400">
                    {new Date().toLocaleTimeString()}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
