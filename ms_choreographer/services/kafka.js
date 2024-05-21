// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

const kafka = new Kafka({
  clientId: 'choreographer',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();

const init = async () => {
  await producer.connect();
};

const sendMessage = async (message) => {
  await producer.send({
    topic: 'choreographer-to-data-input',
    messages: [{ value: message }],
  });
};

module.exports = { init, sendMessage };
