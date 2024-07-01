var express = require('express');
var router = express.Router();
const db = require('../services/database');
var initModels = require("../models/init-models");
let sequelize;
let models;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/delete-problem', async (req, res) => {
  const id = req.body.id; //req.params.id
  try {
    sequelize = await db.getSequelizeInstance();
    models = initModels(sequelize);
    const problem = await models.Results.findByPk(id);
    if (problem) {
      await problem.destroy();
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Problem not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
})

module.exports = router;
