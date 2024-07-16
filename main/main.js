// 모듈
const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');

// 전역 변수
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;

// 정적 파일 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// WebSocket 연결
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

// 서버 시작
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
