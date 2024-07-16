// updateWorker.js
const { parentPort } = require('worker_threads');

const updateData = () => {
  const data = {
    timestamp: new Date(),
    value: Math.random(),
  };
  parentPort.postMessage(data);
};

// 0.5초마다 데이터를 갱신하여 메인 스레드로 전송
setInterval(updateData, 500);
