import React, { useState } from 'react';

  function ProblemForm({ closeModal }) {

    const handleSubmit = async (event) => {
        event.preventDefault();
        const formData = {
            name,
            username,
            problemData,
            solver
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

  const solvers = ['Solver 1', 'Solver 2', 'Solver 3']; // replace with your actual solvers

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
          {solvers.map((solver) => (
            <option key={solver} value={solver}>
              {solver}
            </option>
          ))}
        </select>
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}

export default ProblemForm;