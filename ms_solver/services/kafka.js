// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');

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
        const topending = {
          problemId : receivedMessage.problemId,
          status: 'pending'
        }
        sendMessage('UPDATED_STATUS', topending);
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