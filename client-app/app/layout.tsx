// app/layout.tsx
import Link from 'next/link';
import './globals.css';

export const metadata = {
  title: 'Real-Time Demos',
  description: 'Chat, Game, and Live Scores',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-100 text-gray-900">
        <nav className="bg-white shadow p-4 flex gap-4">
          <Link href="/" className="hover:underline text-green-600">🎮 Game (WebSocket) </Link>
          <Link href="/socket" className="hover:underline text-blue-600">💬 Chat (Socket.IO) </Link>
          <Link href="/sse" className="hover:underline text-red-600">📢 Live Scores (SSE)</Link>
        </nav>
        <main className="p-6">{children}</main>
      </body>
    </html>
  );
}
