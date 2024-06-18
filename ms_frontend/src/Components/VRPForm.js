import React, { useState } from 'react';
import '../index.css';

function VRPForm({ SendToParent }) {
  const [NumVehicles, setNumVehicles] = useState('');
  const [Depot, setDepot] = useState('');
  const [MaxDistance, setMaxDistance] = useState('');
  const [Locations, setLocations] = useState('');

  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => { 
      const text = (e.target.result);
      let parsedInputData;
      try {
        parsedInputData = JSON.parse(text);
        setNumVehicles(parsedInputData.NumVehicles|| 0);
        setDepot(parsedInputData.Depot|| 0);
        setMaxDistance(parsedInputData.MaxDistance|| 0);
        setLocations(JSON.stringify(parsedInputData.Locations, null, 2)|| '');
      } catch (error) {
        alert('Input Data is not a valid JSON object');
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleClick = async () => {
    let parsedDepot = 0;
    let parsedLocations;
    let numberOfNodes = 0;
    try {
      parsedDepot = parseInt(Depot);
    } catch (error) {
        alert('Depot must be an integer');
        return;
    }
    try {
      parsedLocations = JSON.parse(Locations);
    } catch (error) {
      alert('Locations must be a valid JSON object');
      return;
    } 
    try {
      numberOfNodes = Array.isArray(parsedLocations) ? parsedLocations.length : Object.keys(parsedLocations).length;
    }
    catch (error) {
      alert('Locations must be a valid JSON object');
      return;
    }
    // Check if any field is empty
    if (!NumVehicles || !MaxDistance || !Locations) {
        alert('All fields must be filled out');
        return;
    }
    // Check if Depot is an integer between 0 and numberOfNodes - 1
    if (!Number.isInteger(parsedDepot) || parsedDepot < 0 || parsedDepot >= numberOfNodes) {
        alert('Depot must be an integer between 0 and ' + (numberOfNodes - 1));
        return;
    }

    const formData = {
        NumVehicles,
        Depot: parsedDepot,
        MaxDistance,
        Locations: parsedLocations,
    };
    try{
    alert('Data is valid')
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
        NumVehicles:
        <input type="number" value={NumVehicles} onChange={(e) => setNumVehicles(e.target.value)} />
      </label>
      <label>
        Depot:
        <input type="number" value={Depot} onChange={(e) => setDepot(e.target.value)} />
      </label>
      <label>
        MaxDistance:
        <input type="number" value={MaxDistance} onChange={(e) => setMaxDistance(e.target.value)} />
      </label>
      <label>
        Locations:
        <textarea rows="10" cols="50" value={Locations} onChange={(e) => setLocations(e.target.value)} />
      </label>
      <button type="button" onClick={handleClick}>Check Data</button>
    </div>
  );
}

export default VRPForm;