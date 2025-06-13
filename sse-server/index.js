const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());

app.get("/sse", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const interval = setInterval(() => {
    const data = `data: Score update at ${new Date().toLocaleTimeString()}\n\n`;
    res.write(data);
  }, 3000);

  req.on("close", () => clearInterval(interval));
});

app.listen(4002, () => console.log("SSE server running on port 4002"));
