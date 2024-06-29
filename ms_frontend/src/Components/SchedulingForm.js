import React, { useState } from 'react';

function SchedulingForm({ sendToParent }) {
  const [numEmployees, setNumEmployees] = useState('');
  const [numShifts, setNumShifts] = useState('');
  const [numDays, setNumDays] = useState('');
  const [shiftRequests, setShiftRequests] = useState('');

  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      let parsedInputData;
      try {
        parsedInputData = JSON.parse(text);
        setNumEmployees(parsedInputData.NumEmployees.toString() || '');
        setNumShifts(parsedInputData.NumShifts.toString() || '');
        setNumDays(parsedInputData.NumDays.toString() || '');
        setShiftRequests(JSON.stringify(parsedInputData.ShiftRequests, null, 2) || '');
      } catch (error) {
        alert('Input Data is not a valid JSON object');
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleSubmit = () => {
    let parsedShiftRequests;
    const parsedNumEmployees = parseInt(numEmployees, 10);
    const parsedNumShifts = parseInt(numShifts, 10);
    const parsedNumDays = parseInt(numDays, 10);

    try {
      parsedShiftRequests = JSON.parse(shiftRequests);
    } catch (error) {
      alert('Error parsing shift requests. Ensure it is a correctly formatted JSON array.');
      return;
    }

    if (isNaN(parsedNumEmployees) || isNaN(parsedNumShifts) || isNaN(parsedNumDays)) {
      alert('Number of employees, shifts, and days must be valid numbers.');
      return;
    }

    if (!Array.isArray(parsedShiftRequests)) {
      alert('Shift requests input must be an array.');
      return;
    }

    const formData = {
      NumEmployees: parsedNumEmployees,
      NumShifts: parsedNumShifts,
      NumDays: parsedNumDays,
      ShiftRequests: parsedShiftRequests,
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
        Number of Employees:
        <input type="number" value={numEmployees} onChange={(e) => setNumEmployees(e.target.value)} />
      </label>
      <label>
        Number of Shifts:
        <input type="number" value={numShifts} onChange={(e) => setNumShifts(e.target.value)} />
      </label>
      <label>
        Number of Days:
        <input type="number" value={numDays} onChange={(e) => setNumDays(e.target.value)} />
      </label>
      <label>
        Shift Requests (JSON Array):
        <textarea rows="5" cols="50" value={shiftRequests} onChange={(e) => setShiftRequests(e.target.value)} />
      </label>
      <br />
      <button type="button" onClick={handleSubmit}>Check Data</button>
    </div>
  );
}

export default SchedulingForm;