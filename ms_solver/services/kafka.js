// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');


var {solveProblem} = require('../routes/utils');

dotenv.config();

const kafka = new Kafka({
  clientId: 'solver',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'solver-group' });
const producer = kafka.producer();

const init = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'choreographer-to-all', fromBeginning: true });
  await consumer.subscribe({ topic: 'NEW_PROBLEM_WITH_ID_RECEIVED', fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== 'choreographer-to-all' && topic !== 'NEW_PROBLEM_WITH_ID_RECEIVED') {
        console.log('Unknown topic');
        return;
      }
      const receivedMessage = message.value.toString();
      console.log(`Solver received message from choreographer: ${receivedMessage}`);

      //receives new problem:
      if (topic === 'NEW_PROBLEM_WITH_ID_RECEIVED') {
        try {
          const formData = JSON.parse(receivedMessage);
          console.log(formData);
          const { problemId, problemData, timeSubmitted, solver, status, userName, name} = formData;

          const NewProblem = {
            problemId: problemId,
            problemName: name,
            problemData: problemData,
            timeSubmitted: timeSubmitted,
            solver: solver,
            status: status,
            userName: userName
          };

          console.log('New problem with ID:', NewProblem.problemId);
          console.log('New problem with name:', NewProblem.problemName);
          console.log('New problem with status:', NewProblem.status);

          //change the status to pending and send it back to the list
          //change the status to pending for the NewProblem of the solver
          NewProblem.status = 'pending';

          const toPending = {
            problemId : NewProblem.problemId,
            status: NewProblem.status
          };
          await sendMessage('UPDATED_STATUS', toPending);
          
          //solve the problem
          let [result, solveTime]= await solveProblem(NewProblem.solver, NewProblem.problemData);
          console.log("Problem Result:\n", result);
          console.log("Solve Time:", solveTime, "ms");
          
          //send results
          let resultsReady = {
            problemId: NewProblem.problemId,
            problemName: NewProblem.problemName,
            userName: NewProblem.userName,
            solver: NewProblem.solver,
            problemInput: NewProblem.problemData,
            problemOutput: result,
            timeSubmitted: NewProblem.timeSubmitted,
            solveTime: solveTime
          }
          await sendMessage('RESULTS_READY', resultsReady);

          //update the status to solved
          NewProblem.status = 'solved';
          const toSolved = {
            problemId : NewProblem.problemId,
            status: NewProblem.status
          };
          await sendMessage('UPDATED_STATUS', toSolved);
          
        } catch (error) {
          console.log('Error receiving message from list', error);
        }
      }
    }
    });
};

async function sendMessage(topic, message) {
  await producer.connect();
  await producer.send({
    topic: topic,
    messages: [{ value: JSON.stringify(message) }],
  });
  console.log(`Sent message to ${topic}: ${JSON.stringify(message)}`);
  await producer.disconnect();
}

module.exports = { init, sendMessage };