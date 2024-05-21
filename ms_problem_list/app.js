const express = require('express');
const bodyParser = require('body-parser');
const db = require('./services/database');

const app = express();
app.use(bodyParser.json());

app.post('/problems', async (req, res) => {
  try {
    const problem = await db.Problem.create(req.body);
    res.status(201).json(problem);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/problems', async (req, res) => {
  try {
    const problems = await db.Problem.findAll();
    res.status(200).json(problems);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(3000, async () => {
  console.log('Server is running on port 3000');

  try {
    await db.createDatabaseIfNotExists().then(db.syncModels);
    await db.sequelize.authenticate();
    console.log('Database connected!');

  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
});

