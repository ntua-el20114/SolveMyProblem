// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

const kafka = new Kafka({
  clientId: 'dummy',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'dummy-group' });

const init = async () => {
  await consumer.connect();
  await consumer.subscribe({ topic: 'choreographer-to-data-input', fromBeginning: true });

  consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const receivedMessage = message.value.toString();
      console.log(`Received message from choreographer: ${receivedMessage}`);
    },
  });
};

module.exports = { init };
