// services/kafka.js
const { Kafka } = require('kafkajs');
const dotenv = require('dotenv');
const { getSequelizeInstance } = require('./database');
var initModels = require("../models/init-models");

dotenv.config();

const kafka = new Kafka({
  clientId: 'problem_list',
  brokers: [process.env.KAFKA_BROKER]
});

const consumer = kafka.consumer({ groupId: 'problem_list-group' });
const producer = kafka.producer();

const init = async () => {
  const sequelize = await getSequelizeInstance();
  var models = initModels(sequelize);
  //console.log("after kafka init", sequelize);
  
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
          const formData = JSON.parse(receivedMessage);
          const { name, username, inputData, solver } = formData;

          //add the new problem to the db
          const NewProblem = {
            name: name,
            userName: username,
            problemData: inputData, //store input data as json
            timeSubmitted : new Date(),
            solver: solver,
            status: 'submitted'
          };
          console.log(NewProblem);

          const problemWithId = await models.Problems.create(NewProblem);
          console.log('New problem added successfully to the database!');

          const message = {
            problemId: problemWithId.id,
            userName: username,
            solver: solver,
            status: 'submitted',
          }
          sendMessage('UPDATED_LIST', message);
          sendMessage('NEW_PROBLEM_WITH_ID', problemWithId);

        } catch (error) {
          console.error('Error parsing message or adding problem to the db:', error);
        }
      }

      //what will happen when status is updated (to pending or solved)
      if (topic === 'STATUS_UPDATE') {
        if (receivedMessage.status === 'pending') {
          //update db
          const problem = await models.Problems.findByPk(receivedMessage.problemWithId);
          problem.status = receivedMessage.status;
          await problem.save();
          
          //update analytics (via updated_list)
          const message = {
            problemId: receivedMessage.problemWithId,
            status: receivedMessage.status
          }
          sendMessage('UPDATED_LIST_STATUS', message)
        }
      //if statement for 'solved' status update
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