const WebSocket = require("ws");
const express = require("express");
const cors = require("cors");
const http = require("http");
const app = express();

app.use(cors());

const server = http.createServer(app);
const wss = new WebSocket.Server({ port: 4001 });

wss.on("connection", (ws) => {
  console.log("Player connected");

  ws.on("message", (message) => {
    wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  });

  ws.on("close", () => {
    console.log("Player disconnected");
  });
});

server.listen(4000, () => console.log("WebSocket Game Server running on port 4001"));