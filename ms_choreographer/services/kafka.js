// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

dotenv.config();

const kafka = new Kafka({
  clientId: 'choreographer',
  brokers: [process.env.KAFKA_BROKER]
});

const producer = kafka.producer();
const consumer = kafka.consumer({ groupId: 'choreographer-group' });

const init = async () => {
  await producer.connect();
};

const sendMessage = async (message) => {
  await producer.send({
    topic: 'choreographer-to-data-input',
    messages: [{ value: message }],
  });
};

async function receiveMessage(topic) {
  await consumer.connect();
  await consumer.subscribe({ topic: topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`Received message from ${topic}: ${value}`);
      
      // Do something with the message based on the topic
      if (topic == 'NEW_PROBLEM') {
        console.log('New problem:', value);
      }
    }
  });
}

module.exports = { init, sendMessage, receiveMessage };
