import React, { useState } from 'react';
import '../index.css';

function JobShopForm({ sendToParent }) {
  const [JobsData, setJobsData] = useState('');

  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      let parsedInputData;
      try {
        parsedInputData = JSON.parse(text);
        setJobsData(JSON.stringify(parsedInputData.JobsData, null, 2) || '');
      } catch (error) {
        alert('Input Data is not a valid JSON object');
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleClick = () => {
    let parsedJobsData;
    try {
      parsedJobsData = JSON.parse(JobsData);
    } catch (error) {
      alert('Jobs data must be a valid JSON object');
      return;
    }

    if (!Array.isArray(parsedJobsData) || !parsedJobsData.every(job => Array.isArray(job) && job.every(task => Array.isArray(task) && task.length === 2 && typeof task[0] === 'number' && typeof task[1] === 'number'))) {
      alert('Jobs data must be a list of jobs, where each job is a list of tasks, and each task is a tuple of (machine, duration) with both machine and duration being numbers.');
      return;
    }

    const formData = {
      JobsData: parsedJobsData,
    };

    try {
      alert('Data is valid');
      sendToParent(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div>
      <label>
        JSON File:
        <input type="file" accept=".json" onChange={handleFileChange} />
      </label>
      <label>
        Jobs Data:
        <textarea rows="10" cols="50" value={JobsData} onChange={(e) => setJobsData(e.target.value)} />
      </label>
      <br />
      <button type="button" onClick={handleClick}>Check Data</button>
    </div>
  );
}

export default JobShopForm;