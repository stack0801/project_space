const express = require('express');           // express 모듈
const WebSocket = require('ws');              // 웹 소켓 모듈
const { Worker } = require('worker_threads'); // 멀리스레드를 위한 worker_threads 라이브러리

// http 서버 설정
const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('WebSocket server is running. Open the console to see updates.');
});

const server = app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// WebSocket 서버 설정
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
    console.log('Client connected');

    // 클라이언트 연결 시, 일정 간격으로 시뮬레이션 데이터 전송
    const sendDataInterval = setInterval(() => {
        ws.send(JSON.stringify(simulationData));
    }, 100);

    ws.on('close', () => {
        console.log('Client disconnected');
        clearInterval(sendDataInterval);
    });
});

function runWorker(data) {
  return new Promise((resolve, reject) => {
      const worker = new Worker('./worker.js', { workerData: data });
      worker.on('message', resolve);
      worker.on('error', reject);
      worker.on('exit', (code) => {
          if (code !== 0)
              reject(new Error(`Worker stopped with exit code ${code}`));
      });
  });
}