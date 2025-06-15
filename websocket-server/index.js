const WebSocket = require("ws");
const http = require("http");
const { v4: uuidv4 } = require("uuid"); // npm install uuid

const server = http.createServer();
const wss = new WebSocket.Server({ server });

let players = [];
let gameState = Array(9).fill(null);
let currentTurn = "X";
let winner = null;

function checkWinner(state) {
  const combos = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let combo of combos) {
    const [a, b, c] = combo;
    if (state[a] && state[a] === state[b] && state[a] === state[c]) {
      return state[a];
    }
  }
  return state.includes(null) ? null : "Draw";
}

function broadcast(data) {
  players.forEach((player) => {
    if (player.ws.readyState === WebSocket.OPEN) {
      player.ws.send(JSON.stringify(data));
    }
  });
}

function getAvailableSymbol() {
  const assigned = players.map((p) => p.symbol);
  if (!assigned.includes("X")) return "X";
  if (!assigned.includes("O")) return "O";
  return null;
}

wss.on("connection", (ws) => {
  players = players.filter((p) => p.ws.readyState === WebSocket.OPEN);

  const symbol = getAvailableSymbol();
  if (!symbol) {
    ws.send(JSON.stringify({ type: "full" }));
    ws.close();
    return;
  }

  const player = { id: uuidv4(), ws, symbol };
  players.push(player);

  ws.send(
    JSON.stringify({
      type: "init",
      symbol,
      gameState,
      currentTurn,
    })
  );

  // Handle moves
  ws.on("message", (message) => {
    const data = JSON.parse(message);
    if (data.type === "move") {
      const { index, symbol } = data;
      if (gameState[index] || winner || currentTurn !== symbol) return;

      gameState[index] = symbol;
      currentTurn = symbol === "X" ? "O" : "X";
      winner = checkWinner(gameState);

      broadcast({
        type: "update",
        gameState,
        currentTurn,
        winner,
      });
    }
  });

  ws.on("close", () => {
    players = players.filter((p) => p.ws !== ws);
    gameState = Array(9).fill(null);
    currentTurn = "X";
    winner = null;
    broadcast({ type: "reset", gameState, currentTurn });
  });
});

setInterval(() => {
  players = players.filter((p) => p.ws.readyState === WebSocket.OPEN);
}, 5000);

server.listen(4001, () => {
  console.log("✅ WebSocket server running on port 4001");
});
