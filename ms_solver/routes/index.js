var express = require('express');
var router = express.Router();
var { spawn } = require('child_process');
const fs = require('fs')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

/* Solve problem using main.py Python process. */
function solveProblem(problemType, problemData) {
  return new Promise((resolve, reject) => {
    var dataToSend = '';
    var process = spawn('python3', ['./python/main.py', problemType, JSON.stringify(problemData)]);

    process.stdout.on('data', (data) => {
      dataToSend += data.toString();
    });

    process.stderr.on('data', (data) => {
      console.error(`stderr: ${data}`);
    });

    process.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`child process exited with code ${code}`));
      }
      resolve(dataToSend);
    });
  });
}

// DELETEME Solve test routing problem using dummy data
fs.readFile('routes/vrptw_data.json', 'utf8', (err, jsonString) => {
  if (err) {
      console.log("File read failed:", err);
      return;
  }
  try {
      const dummyData = JSON.parse(jsonString);
      // console.log("Data read from file:", dummyData);
      solveProblem('VRPTW', dummyData)
        .then(result => {
          console.log(result);
        })
        .catch(error => {
          console.error(error);
        });
  } catch(err) {
      console.log('Error parsing JSON string:', err);
  }
});

module.exports = router;