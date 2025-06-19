"use client";
import { useEffect, useRef, useState } from "react";

type Cell = "X" | "O" | null;

export default function GamePage() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [symbol, setSymbol] = useState<"X" | "O" | null>(null);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [winner, setWinner] = useState<Cell | "Draw" | null>(null);
  const socketRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const socket = new WebSocket("ws://localhost:4001");
    socketRef.current = socket;

    socket.onmessage = (e) => {
      const data = JSON.parse(e.data);
      if (data.type === "init") {
        setSymbol(data.symbol);
        setBoard(data.gameState);
        setTurn(data.currentTurn);
      } else if (data.type === "update") {
        setBoard(data.gameState);
        setTurn(data.currentTurn);
        setWinner(data.winner || null);
      } else if (data.type === "reset") {
        setBoard(data.gameState);
        setTurn(data.currentTurn);
        setWinner(null);
      } else if (data.type === "full") {
        alert("Room is full. Try again later.");
      }
    };

    return () => socket.close();
  }, []);

  const handleClick = (index: number) => {
    if (!symbol || board[index] || turn !== symbol || winner) return;
    socketRef.current?.send(JSON.stringify({ type: "move", index, symbol }));
  };

  return (
    <div className="flex flex-col items-center justify-center bg-gradient-to-br from-gray-100 to-indigo-200 p-10 py-40 rounded-2xl">
      <h1 className="text-3xl font-bold mb-6 text-indigo-700">
        🎯 Tic-Tac-Toe
      </h1>
      <p className="mb-2 text-sm text-gray-600">
        You are: <span className="font-semibold">{symbol}</span>
      </p>
      <div className="grid grid-cols-3 gap-2 w-60 mb-4">
        {board.map((cell, i) => (
          <button
            key={i}
            className={`h-20 w-20 text-3xl font-bold border rounded cursor-pointer ${
              cell === "X" ? "text-red-500" : "text-blue-500"
            } bg-white hover:bg-indigo-100`}
            onClick={() => handleClick(i)}
          >
            {cell}
          </button>
        ))}
      </div>
      {winner ? (
        <p className="text-xl font-semibold text-green-700">
          {winner === "Draw" ? "It's a Draw!" : `🎉 ${winner} Wins!`}
        </p>
      ) : (
        <p className="text-sm text-gray-600">Turn: {turn}</p>
      )}
    </div>
  );
}
