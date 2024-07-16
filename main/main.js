const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const path = require('path');
const { Worker } = require('worker_threads');

// 전역 변수
const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });
const PORT = 3000;
let sharedData = { timestamp: new Date(), value: 0 }; // 공유 데이터

// 정적 파일 제공
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// 데이터 갱신 워커 스레드
const updateWorker = new Worker(path.join(__dirname, 'updateWorker.js'));
updateWorker.on('message', (data) => {
  sharedData = data;
});
updateWorker.on('error', (err) => {
  console.error('Update Worker Error:', err);
});
updateWorker.on('exit', (code) => {
  if (code !== 0)
    console.error(`Update Worker stopped with exit code ${code}`);
});

// WebSocket 연결
wss.on('connection', (ws) => {
  console.log('New client connected');

  const sendWorker = new Worker(path.join(__dirname, 'sendWorker.js'));

  sendWorker.on('message', () => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(sharedData));
    }
  });
  sendWorker.on('error', (err) => {
    console.error('Send Worker Error:', err);
  });
  sendWorker.on('exit', (code) => {
    if (code !== 0)
      console.error(`Send Worker stopped with exit code ${code}`);
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    sendWorker.terminate();
  });

  ws.on('error', (error) => {
    console.error(`WebSocket error: ${error}`);
    sendWorker.terminate();
  });
});

// 서버 시작
server.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});
