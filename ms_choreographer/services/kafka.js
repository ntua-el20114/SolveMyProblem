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

const sendMessage = async (topic, message) => {
  await producer.send({
    topic: topic,
    messages: [{ value: message }],
  });
};

async function receiveMessage(topic) {
  await consumer.connect();
  await consumer.subscribe({ topic: topic });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`Received message from ${topic}`);
      
      // Do something with the message based on the topic
      if (topic == 'NEW_PROBLEM') {
        console.log('New problem:', value);
        await sendMessage('NEW_PROBLEM_RECEIVED', value);
      }
      else if (topic == 'UPDATED_STATUS') {
        console.log('Updated status:', value);
        await sendMessage('STATUS_UPDATE', value);
      }
      else if (topic == 'RESULTS_READY') {
        console.log('Results:', value);
        await sendMessage('RESULTS', value);
      }
      else if (topic == 'UPDATED_LIST') {
        console.log('Updated list:', value);
        await sendMessage('UPDATE', value);
      }
      else {
        console.log('Unknown topic:', topic);
      }
    }
  });
}

module.exports = { init, sendMessage, receiveMessage };
