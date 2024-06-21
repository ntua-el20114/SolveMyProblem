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
  await consumer.subscribe({ topic: 'NEW_PROBLEM', fromBeginning: true });
  await consumer.subscribe({ topic: 'NEW_PROBLEM_WITH_ID', fromBeginning: true });
  await consumer.subscribe({ topic: 'UPDATED_STATUS', fromBeginning: true });
  await consumer.subscribe({ topic: 'RESULTS_READY', fromBeginning: true });
  await consumer.subscribe({ topic: 'UPDATED_LIST', fromBeginning: true });
  await consumer.subscribe({ topic: 'UPDATED_LIST_STATUS', fromBeginning: true });

  await consumer.run({
    eachMessage: async ({ topic, partition, message }) => {
      const value = message.value.toString();
      console.log(`Received message from ${topic}`);
      
      // Do something with the message based on the topic
      if (topic == 'NEW_PROBLEM') { //from data_input to list
        console.log('New problem:', value);
        await sendMessage('NEW_PROBLEM_RECEIVED', value);
      }
      else if (topic == 'NEW_PROBLEM_WITH_ID') { //from list
        console.log('New problem with ID:', value);
        await sendMessage('NEW_PROBLEM_WITH_ID_RECEIVED', value); //to solver
      }
      else if (topic == 'UPDATED_STATUS') { //from solver to choreo. 
        console.log('Updated status:', value);
        await sendMessage('STATUS_UPDATE', value); //list receives that
      }
      else if (topic == 'UPDATED_LIST_STATUS') { //prob list sends that
        console.log('Updated status to analytics:', value);
        await sendMessage('UPDATE_STATUS', value); //analytics receives that
      }
      else if (topic == 'RESULTS_READY') { //from solver to results
        console.log('Results:', value);
        await sendMessage('RESULTS', value); 
      }
      else if (topic == 'UPDATED_LIST') { //from list to analytics
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
