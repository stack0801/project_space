const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

wss.on('connection', (ws) => {
  console.log('New client connected');
  
  const sendData = () => {
    if (ws.readyState === WebSocket.OPEN) {
      const data = {
        timestamp: new Date(),
        value: Math.random(), // Example data
      };
      ws.send(JSON.stringify(data));
    }
  };

  const interval = setInterval(sendData, 1000);

  ws.on('close', () => {
    console.log('Client disconnected');
    clearInterval(interval);
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
    clearInterval(interval);
  });
});

server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
