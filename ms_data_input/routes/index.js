var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var kafkaService = require('../services/kafka');
var cors = require('cors');

// configure cors to only accept requests from http://localhost:3000
var corsOptions = {
  origin: 'http://localhost:3000'
}
router.use(cors(corsOptions)); // use the cors middleware with the specified options

/* GET Data_input page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Data_Input' });
});


router.use(bodyParser.json());

/* POST new problem. */
router.post('/new-problem', function(req, res, next) {

  // Check if req.body is an object and not empty
  if (typeof req.body === 'object' && Object.keys(req.body).length > 0) {
    next();
  } else {
    next(new Error('Empty Object or Non-Object received.'));
  }
}, 

function(req, res, next) {
  // Send message to Kafka
  kafkaService.sendMessage('NEW_PROBLEM', req.body)
    .then(() => {
      res.status(200).send('Problem received and sent to choreographer.\n');
    })
    .catch((error) => {
      next(error);
    });
});

// Error-handling middleware function
router.use(function(err, req, res, next) {
  console.error(err.stack);
  res.status(500).send('Something broke!\n');
});

module.exports = router;