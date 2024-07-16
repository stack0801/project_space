// sendWorker.js
const { parentPort } = require('worker_threads');

const sendData = () => {
  parentPort.postMessage('send');
};

// 1초마다 메인 스레드로 전송 신호
setInterval(sendData, 1000);
