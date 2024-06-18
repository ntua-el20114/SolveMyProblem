const express = require('express');
const bodyParser = require('body-parser');
const db = require('./services/database');
const kafkaService = require('./services/kafka');
const cors = require('cors');

const app = express();
const port = 3003;
app.use(bodyParser.json());
app.use(cors());

// Kafkannot problem list

kafkaService.init()
  .catch((error) => {
    console.error('Error initializing Kafka:', error);
  });

app.post('/problems', async (req, res) => {
  try {
    const problem = await db.Problem.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/problems', async (req, res) => {
  try {
    const problems = await db.Problem.findAll();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, async () => {
  console.log(`Problem list is running on port: ${port}`);

  try {
    await db.createDatabaseIfNotExists().then(db.syncModels);
    await db.sequelize.authenticate();
    console.log('Database connected!');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

