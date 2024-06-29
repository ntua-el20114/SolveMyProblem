// Results.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../index.css'; // import the CSS file

function Results() {
  const [problems, setProblems] = useState([]);
  const [selectedProblem, setSelectedProblem] = useState(null);

  useEffect(() => {
    fetchProblems();
  }, []);

  const fetchProblems = async () => {
    try {
      const response = await fetch('http://localhost:3003/problems');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setProblems(data); // Update the state with the fetched problems
    } catch (error) {
      console.error('Error fetching problems:', error);
    }
  };

  return (
    <div>
      <Header />
    <h1 className="left-to-right-slow center-screen">Results</h1>
    <div style={{ display: 'flex', flexDirection: 'row' }}>
      <div style={{ flex: 1, marginRight:'20px'}} className='results'>
        <h1>Problems</h1>
        <ul>
          {problems.map((problem, index) => (
            <li key={index} onClick={() => setSelectedProblem(problem)}>
              {problem.name}
            </li>
          ))}
        </ul>
      </div>
      <div style={{ flex: 2 }}>
        {selectedProblem ? (
          <div>
            <h1>{selectedProblem.name}</h1>
            <p style={{color:'white'}}>{selectedProblem.problemData}</p>
          </div>
        ) : (
          <h1 className="left-to-right-slow center-screen">Select a problem</h1>
        )}
      </div>
    </div>
    </div>
  );
}

export default Results;