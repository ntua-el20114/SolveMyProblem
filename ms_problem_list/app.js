const express = require('express');
const bodyParser = require('body-parser');
const db = require('./services/database');
const path = require('path');
const kafkaService = require('./services/kafka');
const cors = require('cors');
const indexRouter = require('./routes/index');

const app = express();
const port = 3003;
app.use(bodyParser.json());
app.use(cors());

// Kafkannot problem list

//kafkaService.init()
//  .catch((error) => {
//    console.error('Error initializing Kafka:', error);
//  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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

