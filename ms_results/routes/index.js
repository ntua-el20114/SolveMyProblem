const express = require('express');

var router = express.Router();
const db = require('../services/database');
var initModels = require("../models/init-models");
let sequelize;
let models;

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/results', async (req, res) => {
  try {
    sequelize = await db.getSequelizeInstance();
    models = initModels(sequelize);
    const result = await models.Results.create(req.body);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/results', async (req, res) => {
  try {
    sequelize = await db.getSequelizeInstance();
    models = initModels(sequelize);
    const results = await models.Results.findAll();
    res.status(200).json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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
