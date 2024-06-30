var { spawn } = require('child_process');
const fs = require('fs')

/* Solve problem using main.py Python process. */
function solveProblem(problemType, problemData) {
    return new Promise((resolve, reject) => {
      var problemResult = '';
      data = JSON.stringify(problemData);
      // type = JSON.stringify(problemType);
      type = problemType;
      try{
        var process = spawn('python3', ['./python/main.py', type, data]);
      }
      catch(error){
        console.error(error);
        return reject(error);
      }

      // Check and display print messages. Keep the result of the problem.
      process.stdout.on('data', (data) => {
        const output = data.toString().trim();
        // console.log(output);

        // Save the result of the problem
        const start = output.indexOf('__START__');
        const end = output.indexOf('__END__', start);
        if (start !== -1 && end !== -1) {
          problemResult = output.substring(start+9, end);
        }
      });
  
      process.stderr.on('data', (data) => {
        console.error(`stderr: ${data}`);
      });
  
      process.on('close', (code) => {
        if (code !== 0) {
          return reject(new Error(`child process exited with code ${code}`));
        }
        resolve(JSON.parse(problemResult));
      });
    });
  }
  
  //Solve test routing problem using dummy data
  function dummyTest(problemType) {
    const path = `routes/dummy_data/${problemType}.json`;
    fs.readFile(path, 'utf8', (err, jsonString) => {
      if (err) {
          console.log("File read failed:", err);
          return;
      }
      try {
          const dummyData = JSON.parse(jsonString);
          // console.log("Data read from file:", dummyData);
          solveProblem(problemType, dummyData)
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
  }

module.exports = {solveProblem, dummyTest}