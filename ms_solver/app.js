var express = require('express');
var path = require('path');
const kafkaService = require('./services/kafka');
const cors = require('cors');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();
const port = 3004;
app.use(cors());

// Kafkannot solver

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
    console.log(`Solver is running on port ${port}`);
});

module.exports = app;
