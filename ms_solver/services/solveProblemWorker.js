// This file's sole purpose is to work the solveProblem() function in a seperate thread

const { parentPort } = require('worker_threads');
var { solveProblem } = require('../routes/utils');

// When a message is received from the parent thread, solve the problem and send the result back
console.log("Worker created");
parentPort.on('message', async ({ solver, problemData }) => {
    console.log("Worker started working on problem")
    const [result, solveTime] = await solveProblem(solver, problemData);
    console.log("Worker finished working on problem")
    parentPort.postMessage({ result, solveTime });
});