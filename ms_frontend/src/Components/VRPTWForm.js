import React, { useState } from 'react';
import '../index.css';

function VRPTWForm({ SendToParent }) {
  const [Locations, setLocations] = useState('');
  const [TimeWindows, setTimeWindows] = useState('');
  const [Speed, setSpeed] = useState('');
  const [NumVehicles, setNumVehicles] = useState('');
  const [Depot, setDepot] = useState('');
  const [MaxTime, setMaxTime] = useState('');
  const [TimeSlack, setTimeSlack] = useState('');

  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      let parsedInputData;
      try {
        parsedInputData = JSON.parse(text);
        setLocations(JSON.stringify(parsedInputData.Locations, null, 2) || '');
        setTimeWindows(JSON.stringify(parsedInputData.TimeWindows, null, 2) || '');
        setSpeed(parsedInputData.Speed || 0);
        setNumVehicles(parsedInputData.NumVehicles || 0);
        setDepot(parsedInputData.Depot || 0);
        setMaxTime(parsedInputData.MaxTime || 0);
        setTimeSlack(parsedInputData.TimeSlack || 0);
      } catch (error) {
        alert('Input Data is not a valid JSON object');
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleClick = async () => {
    let parsedDepot = 0;
    let parsedLocations, parsedTimeWindows;
    try {
      parsedDepot = parseInt(Depot);
      parsedLocations = JSON.parse(Locations);
      parsedTimeWindows = JSON.parse(TimeWindows);
    } catch (error) {
      alert('Error parsing input fields. Ensure all inputs are correctly formatted.');
      return;
    }
  
    // Basic validation
    if (!NumVehicles || !MaxTime || !Locations || !TimeWindows || !Speed || !TimeSlack) {
      alert('All fields must be filled out');
      return;
    }
  
    // Additional checks
    if (!Array.isArray(parsedLocations) || !parsedLocations.every(loc => 'Latitude' in loc && 'Longitude' in loc)) {
      alert('Locations must be a list of dictionaries with "Latitude" and "Longitude" keys');
      return;
    }
    if (!Array.isArray(parsedTimeWindows) || parsedTimeWindows.length !== parsedLocations.length) {
      alert('TimeWindows must be a list with the same length as Locations');
      return;
    }
    if (Speed <= 0) {
      alert('Speed must be a positive number');
      return;
    }
    if (NumVehicles <= 0 || !Number.isInteger(parseFloat(NumVehicles))) {
      alert('NumVehicles must be a positive integer');
      return;
    }
    if (parsedDepot < 0 || parsedDepot >= parsedLocations.length) {
      alert('Depot index is out of range');
      return;
    }
    if (MaxTime && MaxTime <= 0) {
      alert('MaxTime, if provided, must be a positive number');
      return;
    }
    if (TimeSlack && TimeSlack <= 0) {
      alert('TimeSlack, if provided, must be a positive number');
      return;
    }
  
    const formData = {
      Locations: parsedLocations,
      TimeWindows: parsedTimeWindows,
      Speed: parseFloat(Speed),
      NumVehicles: parseInt(NumVehicles),
      Depot: parsedDepot,
      MaxTime: parseFloat(MaxTime),
      TimeSlack: parseFloat(TimeSlack),
    };
  
    try {
      alert('Data is valid');
      SendToParent(formData);
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
        Locations:
        <textarea rows="10" cols="50" value={Locations} onChange={(e) => setLocations(e.target.value)} />
      </label>
      <label>
        TimeWindows:
        <textarea rows="10" cols="50" value={TimeWindows} onChange={(e) => setTimeWindows(e.target.value)} />
      </label>
      <label>
        Speed:
        <input type="number" value={Speed} onChange={(e) => setSpeed(e.target.value)} />
      </label>
      <label>
        NumVehicles:
        <input type="number" value={NumVehicles} onChange={(e) => setNumVehicles(e.target.value)} />
      </label>
      <label>
        Depot:
        <input type="number" value={Depot} onChange={(e) => setDepot(e.target.value)} />
      </label>
      <label>
        MaxTime:
        <input type="number" value={MaxTime} onChange={(e) => setMaxTime(e.target.value)} />
      </label>
      <label>
        TimeSlack:
        <input type="number" value={TimeSlack} onChange={(e) => setTimeSlack(e.target.value)} />
      </label>
      <button type="button" onClick={handleClick}>Check Data</button>
    </div>
  );
}

export default VRPTWForm;