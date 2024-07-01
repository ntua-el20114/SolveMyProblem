// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const { getSequelizeInstance } = require('./database');
var initModels = require("../models/init-models");

dotenv.config();

const kafka = new Kafka({
  clientId: 'results',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'results-group' });
const producer = kafka.producer();

const init = async () => {
  const sequelize = await getSequelizeInstance();
  var models = initModels(sequelize);

  await consumer.connect();
  await consumer.subscribe({ topic: 'choreographer-to-all', fromBeginning: true });
  await consumer.subscribe({ topic: 'RESULTS', fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== 'choreographer-to-all' && topic !== 'RESULTS') {
        console.log('Unknown topic');
      return;
    }
    const receivedMessage = message.value.toString();
    console.log(`Results received message from choreographer: ${receivedMessage}`);

    if (topic === 'RESULTS') {
      //add to db
        try {
          const formData = JSON.parse(receivedMessage);
          const { problemId, problemName, userName, solver, problemInput, problemOutput, timeSubmitted, solveTime } = formData;

          //add results to the db
          const NewResults = {
            problemId: problemId,
            problemName: problemName,
            userName: userName,
            solver: solver,
            problemInput: problemInput,
            problemOutput: problemOutput,
            timeSubmitted: timeSubmitted,
            solveTime: solveTime
          };
          console.log("NewResults:\n",NewResults);

          await models.Results.create(NewResults);
          console.log('New results added successfully to the database!');
        }
        catch (error) {
          console.error('Error parsing message or adding problem to the db:', error);
        }
      }
    },
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