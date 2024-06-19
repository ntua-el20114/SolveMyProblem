var express = require('express');
var router = express.Router();
const {calculateStatistics} = require('../utils/data.js');

router.get('/analytics', function(req, res, next) {
  try {
    const data = calculateStatistics();
    res.send(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
