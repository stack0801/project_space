const { Worker } = require('worker_threads');
const express = require('express');
const app = express();
let simulationData = { position: [0, 0], velocity: [1, 1] };

const worker = new Worker('./worker.js');

worker.on('message', (data) => {
  simulationData = data;
});

app.get('/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify(simulationData)}\n\n`);
  }, 100);

  req.on('close', () => {
    clearInterval(interval);
  });
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3000');
});
