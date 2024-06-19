// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const { getSequelizeInstance } = require('./database');
var initModels = require("../models/init-models");

dotenv.config();

const kafka = new Kafka({
  clientId: 'analytics',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'analytics-group' });
const producer = kafka.producer();

const init = async () => {
  const sequelize = await getSequelizeInstance();
  var models = initModels(sequelize);

  await consumer.connect();
  await consumer.subscribe({ topic: 'choreographer-to-all', fromBeginning: true });
  await consumer.subscribe({ topic: 'UPDATE', fromBeginning: true });


  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      if (topic !== 'choreographer-to-all' && topic !== 'UPDATE') {
        console.log('Unknown topic');
      return;
    }
    const receivedMessage = message.value.toString();
    console.log(`Analytics received message from choreographer: ${receivedMessage}`);

    if (topic === 'UPDATE') {
      try {
        const formData = JSON.parse(receivedMessage);
        console.log(formData);
        const {problemId, userName, solver, status } = formData;

        //add the new analytics to the db
        const NewAnalytics = {
          problemId: problemId,
          userName: userName,
          solver: solver,
          status: status
        };
        console.log(NewAnalytics);

        await models.Analytics.create(NewAnalytics);
        console.log('New analytics added successfully to the database!');
      } catch (error) {
        console.error('Error parsing message or adding problem to the db:', error);
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