const express = require('express');
const db = require('../services/database');
var initModels = require("../models/init-models");
let sequelize;
let models;

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Problem List' });
});

router.post('/problems', async (req, res) => {
  try {
    sequelize = await db.getSequelizeInstance();
    models = initModels(sequelize);
    const problem = await models.Problems.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.get('/problems', async (req, res) => {
  try {
    sequelize = await db.getSequelizeInstance();
    models = initModels(sequelize);
    const problems = await models.Problems.findAll();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/delete-problem', async (req, res) => {
  const {id} = req.body; //req.params.id
  try {
    sequelize = await db.getSequelizeInstance();
    models = initModels(sequelize);
    const problem = await models.Problems.findByPk(id);
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
