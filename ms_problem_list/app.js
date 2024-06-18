const express = require('express');
const bodyParser = require('body-parser');
const db = require('./services/database');
const kafkaService = require('./services/kafka');
const cors = require('cors');
var initModels = require("./models/init-models");
let sequelize;
let models;

const app = express();
const port = 3003;
app.use(bodyParser.json());
app.use(cors());

// Kafkannot problem list

//kafkaService.init()
//  .catch((error) => {
//    console.error('Error initializing Kafka:', error);
//  });

app.post('/problems', async (req, res) => {
  try {
    sequelize = await db.getSequelizeInstance();
    models = initModels(sequelize);
    const problem = await models.Problems.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/problems', async (req, res) => {
  try {
    sequelize = await db.getSequelizeInstance();
    models = initModels(sequelize);
    const problems = await models.Problems.findAll();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(port, async () => {
  console.log(`Problem list is running on port: ${port}`);

  try {
    await db.createDatabaseIfNotExists();
    await db.syncModels();
    console.log('Database connected!');

    await kafkaService.init();
    console.log('Kafka initialized!');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

