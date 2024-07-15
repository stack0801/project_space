const { parentPort } = require('worker_threads');

let simulationData = { position: [0, 0], velocity: [1, 1] };

function simulatePhysics() {
    simulationData.position[0] += simulationData.velocity[0] * 0.1;
    simulationData.position[1] += simulationData.velocity[1] * 0.1;
    parentPort.postMessage(simulationData);
}

setInterval(simulatePhysics, 100);