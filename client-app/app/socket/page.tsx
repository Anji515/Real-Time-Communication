'use client';
import { useEffect, useState } from 'react';
import io, { Socket } from 'socket.io-client';
import { toast, Toaster } from 'react-hot-toast';

export default function ChatPage() {
  const [msg, setMsg] = useState('');
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>([]);
  const [socketId, setSocketId] = useState('');
  const [socket, setSocket] = useState<Socket | null>(null);

  console.log('messages', messages, 'socketId', socketId);
  useEffect(() => {
    const newSocket = io('http://localhost:4000');
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Socket connected with ID:', newSocket.id);
      setSocketId(newSocket.id || '');
    });

    newSocket.on('message', (data) => {
      setMessages((prev) => [...prev, data]);

      if (data.sender !== newSocket.id) {
        toast.success(`New Message 💬 : ${data.text}`, {
          duration: 3000,
          position: 'top-right',
        });
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const sendMessage = () => {
    if (!msg.trim()) return;
    if(socket) socket.emit('message', msg);
    setMsg('');
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-6">
      <Toaster />
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-4 space-y-4">
        <h2 className="text-2xl font-bold text-center">💬 Live Chat</h2>
        <div className="h-96 overflow-y-auto border rounded p-2 bg-gray-50">
          <ul className="space-y-1">
            {messages.map((m, i) => (
              <li
                key={i}
                className={`px-4 py-2 rounded-md ${
                  m.sender === socketId ? 'bg-green-200 text-right' : 'bg-blue-200 text-left'
                }`}
              >
                {m.text}
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
              if (e.key === 'Enter') sendMessage();
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