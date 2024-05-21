var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var kafkaService = require('../services/kafka');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.use(bodyParser.json());

/* POST new problem. */
router.post('/new-problem', function(req, res, next) {
  // Validate request body...
  
  // Send message to Kafka
  kafkaService.sendMessage('NEW_PROBLEM', req.body)
    .then(() => {
      res.status(200).send('Problem received and sent to choreographer.\n');
    })
    .catch((error) => {
      console.error('Error sending message to Kafka:', error);
      res.status(500).send('Error sending problem to choreographer.');
    });
});

module.exports = router;