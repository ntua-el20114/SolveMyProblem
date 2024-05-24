import React, { useState } from 'react';
import '../index.css';

  function ProblemForm({ closeModal }) {
  const [inputData, setinputData] = useState(null);
  const [commandFile, setcommandFile] = useState(null);
  const [pythonFile, setPythonFile] = useState(null);

  const handleFileChange = (e, setFile) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async (event) => {
      event.preventDefault();
      // Check if any field is empty
      if (!name || !username || !problemData || !solver || !inputData || !commandFile || !pythonFile) {
        alert('All fields must be filled out');
        return;
      }
        // Read files and convert to JSON
      const inputDataData = await inputData.text();
      const commandFileData = await commandFile.text();
      const pythonFileData = await pythonFile.text();

      const formData = {
        name,
        username,
        problemData,
        solver,
        inputData: JSON.parse(inputDataData),
        commandFile: JSON.parse(commandFileData),
        pythonFile: pythonFileData
      };
      try {
          const response = await fetch('http://localhost:3002/new-problem', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json'
              },
              body: JSON.stringify(formData)
          });
          if (response.ok) {
              console.log('Form submitted successfully');
              closeModal(); // close the modal when the form is submitted successfully
          } else {
              console.log('Form submission failed');
          }
      } catch (error) {
          console.error('Error submitting form:', error);
      }
  };


  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [problemData, setProblemData] = useState('');
  const [solver, setSolver] = useState('');

  const solvers = ['Routing', 'Scheduling', 'Network Floats']; // replace with your actual solvers

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Problem Data:
        <textarea value={problemData} onChange={(e) => setProblemData(e.target.value)} />
      </label>
      <label>
        Solver:
        <select value={solver} onChange={(e) => setSolver(e.target.value)}>
          <option key={0} value="">Select a solver</option>
          {solvers.map((solver) => (
            <option key={solver} value={solver}>
              {solver}
            </option>
          ))}
        </select>
      </label>
      <label>
        Input Data:
        <input type="file" accept=".json" onChange={(e) => handleFileChange(e, setinputData)} />
      </label>
      <label>
        Command to run:
        <input type="file" accept=".json" onChange={(e) => handleFileChange(e, setcommandFile)} />
      </label>
      <label>
        Python File:
        <input type="file" accept=".py" onChange={(e) => handleFileChange(e, setPythonFile)} />
      </label>
      
      <button type="submit">Submit</button>
    </form>
  );
}

export default ProblemForm;