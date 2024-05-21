var express = require('express');
var router = express.Router();
const kafkaService = require('../services/kafka');


kafkaService.receiveMessage('NEW_PROBLEM')
  .catch((error) => {
    console.error('Error receiving message from Kafka:', error);
  });

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
