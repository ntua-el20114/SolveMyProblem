var express = require('express');
var path = require('path');
const kafkaService = require('./services/kafka');
const cors = require('cors');
const db = require('./services/database');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
app.use(cors());
const port = 3006;

// Kafkannot analytics

/*kafkaService.init()
  .catch((error) => {
    console.error('Error initializing Kafka:', error);
  });*/


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, async () => {
    console.log(`Analytics is running on port ${port}`);

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

module.exports = app;
