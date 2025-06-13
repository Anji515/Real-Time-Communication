"use client";
import { useEffect, useState } from "react";
import io from "socket.io-client";

const socket = io("http://localhost:4000");

export default function ChatPage() {
  const [msg, setMsg] = useState("");
  const [messages, setMessages] = useState<string[]>([]);

  useEffect(() => {
    socket.on("message", (data: string) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;
    socket.emit("message", msg);
    setMsg("");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-4 space-y-4">
        <h2 className="text-2xl font-bold text-center">💬 Live Chat</h2>
        <div className="h-64 overflow-y-auto border rounded p-2 bg-gray-50">
          <ul className="space-y-1">
            {messages.map((m, i) => (
              <li key={i} className="bg-blue-100 px-3 py-1 rounded-md">
                {m}
              </li>
            ))}
          </ul>
        </div>
        <div className="flex space-x-2">
          <input
            className="flex-1 border rounded p-2"
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
            placeholder="Type your message..."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                sendMessage();
              }
            }}
          />
          <button
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
            onClick={sendMessage}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
