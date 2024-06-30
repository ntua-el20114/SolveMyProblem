import React, { useState } from 'react';

function SchedulingForm({ SendToParent }) {
  const [numEmployees, setNumEmployees] = useState('');
  const [numShifts, setNumShifts] = useState('');
  const [numDays, setNumDays] = useState('');
  const [shiftRequests, setShiftRequests] = useState('');
  const [MinShiftsPerEmployee, setMinShiftsPerEmployee] = useState('');
  const [MaxShiftsPerEmployee, setMaxShiftsPerEmployee] = useState('');

  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      let parsedInputData;
      try {
        parsedInputData = JSON.parse(text);
        setNumEmployees(parsedInputData.NumEmployees || 0);
        setNumShifts(parsedInputData.NumShifts || 0);
        setNumDays(parsedInputData.NumDays || 0);
        setShiftRequests(JSON.stringify(parsedInputData.ShiftRequests || [[]], null, 2));
        setMinShiftsPerEmployee(parsedInputData.MinShiftsPerEmployee || 0);
        setMaxShiftsPerEmployee(parsedInputData.MaxShiftsPerEmployee || 0);
      } catch (error) {
        alert('Input Data is not a valid JSON object');
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleClick = () => {
    let parsedShiftRequests, parsedMinShiftsPerEmployee, parsedMaxShiftsPerEmployee;
    const parsedNumEmployees = parseInt(numEmployees, 10);
    const parsedNumShifts = parseInt(numShifts, 10);
    const parsedNumDays = parseInt(numDays, 10);

    try {
      parsedShiftRequests = JSON.parse(shiftRequests);
    } catch (error) {
      alert('Error parsing shift requests. Ensure it is a correctly formatted JSON array.');
      return;
    }
    
    if (MinShiftsPerEmployee !== '' && !Number.isInteger(parseFloat(MinShiftsPerEmployee))) {
      alert('Minimum shifts per employee, if provided, must be a valid number.');
      return;
    }
    if (MaxShiftsPerEmployee !== '' && !Number.isInteger(parseFloat(MaxShiftsPerEmployee))) {
      alert('Maximum shifts per employee, if provided, must be a valid number.');
      return;
    }
    
    try {
      parsedMinShiftsPerEmployee = parseInt(MinShiftsPerEmployee, 10);
      parsedMaxShiftsPerEmployee = parseInt(MaxShiftsPerEmployee, 10);
    }
    catch (error) {
      alert('Minimum and maximum shifts per employee must be valid numbers.');
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
      MinShiftsPerEmployee: parsedMinShiftsPerEmployee,
      MaxShiftsPerEmployee: parsedMaxShiftsPerEmployee,
    };

    try {
      alert('Data is valid');
      SendToParent(formData);
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div style={{width:'50%'}}>
      <p style={{textAlign: 'justify'}}>
        In the Employee Scheduling problem, we want to asign shifts to a number of Employees ("NumEmployees").
        You can specify the number of days ("NumDays") and the shifts of each day ("NumShifts").
        Optionally, you may also provide a list of shift requests ("ShiftRequests") for each employee
        and the maximum and minimum number of shifts per employee ("MinShiftsPerEmployee", "MaxShiftsPerEmployee").
        We look for a schedule that maximizes the number of requests that are met, 
        while satisfying the constraints. 
        If no maximum or minimum shifts are provided, the algorithm will try to distribute the shifts as evenly as possible.
      </p>
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
        Shift Requests:
        <textarea rows="5" cols="50" value={shiftRequests} onChange={(e) => setShiftRequests(e.target.value)} />
      </label>
      <label>
        Minimum Shifts per Employee:
        <input type="number" value={MinShiftsPerEmployee} onChange={(e) => setMinShiftsPerEmployee(e.target.value)} />
      </label>
      <label>
        Maximum Shifts per Employee:
        <input type="number" value={MaxShiftsPerEmployee} onChange={(e) => setMaxShiftsPerEmployee(e.target.value)} />
      </label>
      <br />
      <button type="button" onClick={handleClick}>Check Data</button>
    </div>
  );
}

export default SchedulingForm;