import React, { useState } from 'react';
import '../index.css';
import VRPForm from './VRPForm';
import CVRPForm from './CVRPForm';
import VRPTWForm from './VRPTWForm';
import MaxFlowForm from './MaxFlowForm';
import MinFlowForm from './MinFlowForm';
import SchedulingForm from './SchedulingForm';

  function ProblemForm({ closeModal }) {
    const [InputData, setInputData] = useState(''); // Declare InputData as a state variable

    const getInputData = (FormDataFromInput) => {
      setInputData(FormDataFromInput);
    };

    const handleSubmit = async (event, inputData) => {
      event.preventDefault();
      // Check if any field is empty
      if (!name || !username || !solver) {
        alert('All fields must be filled out');
        return;
      }
      if (inputData == ''){
        alert('Check data before submitting.')
        return;
      }

      const formData = {
        name,
        username,
        solver,
        inputData
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
  const [solver, setSolver] = useState('');

  const solvers = ['Routing - VRP', 'Routing - CVRP', 'Routing - VRPTW', 'Max Flow','Min Cost Flow', 'Scheduling'];
 
  const handleSolverChange = (e) => {
    setSolver(e.target.value);
    setInputData('');
  };

  return (
    <form onSubmit={(event) => handleSubmit(event, InputData)}>
      <label>
        Name:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <label>
        Username:
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} />
      </label>
      <label>
        Solver:
        <select value={solver} onChange={handleSolverChange}>
          <option key={0} value="">Select a solver</option>
          {solvers.map((solver) => (
            <option key={solver} value={solver}>
              {solver}
            </option>
          ))}
        </select>
      </label>
      {solver === 'Routing - VRP' && <VRPForm SendToParent={getInputData}/>}
      {solver === 'Routing - CVRP' && <CVRPForm SendToParent={getInputData}/>}
      {solver === 'Routing - VRPTW' && <VRPTWForm SendToParent={getInputData}/>}
      {solver === 'Max Flow' && <MaxFlowForm SendToParent={getInputData}/>}
      {solver === 'Min Cost Flow' && <MinFlowForm SendToParent={getInputData}/>}
      {solver === 'Scheduling' && <SchedulingForm SendToParent={getInputData}/>}

      <button type="submit">Submit</button>
    </form>
  );
}

export default ProblemForm;