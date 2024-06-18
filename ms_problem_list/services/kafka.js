// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const db = require('./database');
const { BULKDELETE } = require('sequelize/lib/query-types');

dotenv.config();

const kafka = new Kafka({
  clientId: 'problem_list',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'problem_list-group' });
const producer = kafka.producer();

const init = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'choreographer-to-all', fromBeginning: true });
  await consumer.subscribe({ topic: 'NEW_PROBLEM_RECEIVED', fromBeginning: true });
  await consumer.subscribe({ topic: 'STATUS_UPDATE', fromBeginning: true });


  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== 'choreographer-to-all' && topic !== 'NEW_PROBLEM_RECEIVED' && topic !== 'STATUS_UPDATE') {
        console.log('Unknown topic');
      return;
    }
    const receivedMessage = message.value.toString();
    console.log(`Problem List received message from choreographer: ${receivedMessage}`);
    //what will happen when new problem is received
    if (topic === 'NEW_PROBLEM_RECEIVED') {
      //add to db
      try {
        const problemData = JSON.parse(receivedMessage);

        //Destructure the necessary fields from the problemData
        const { name, userName, problemData: data, timeSubmitted, solver, status = 'submitted' } = problemData;

        //add the new problem to the db
        await db.Problem.create({
          name,
          userName,
          problemData: data,
          timeSubmitted,
          solver,
          status
        });

        console.log('New problem added successfully to the database!')
      } catch (error) {
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