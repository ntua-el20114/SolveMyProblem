var express = require('express');
var router = express.Router();
const {calculateStatistics} = require('../utils/data.js');

router.get('/analytics', async function(req, res, next) {
  try {
    const data = await calculateStatistics();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
