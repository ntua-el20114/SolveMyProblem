const express = require('express');
const path = require('path');
const kafkaService = require('./services/kafka');

const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');

const app = express();
const port = 3001;

// Kafkannot

kafkaService.init()
  .then(() => {
    // Send message
    kafkaService.sendMessage('hello from the choreographer');
  })
  .catch((error) => {
    console.error('Error initializing Kafka:', error);
  });


app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

app.listen(port, () => {
  console.log(`Choreographer is running on port ${port}`);
});

module.exports = app;



