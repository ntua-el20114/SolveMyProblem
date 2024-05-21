const express = require('express');
const path = require('path');
const kafkaService = require('./services/kafka');
const cors = require('cors');


const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
app.use(cors());
const port = 3002;

// Kafkannot data_input

kafkaService.init()
  .catch((error) => {
    console.error('Error initializing Kafka:', error);
  });

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Data input is running on port ${port}`);
});

module.exports = app;



