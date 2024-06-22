import React, { useState } from 'react';
import '../index.css';

function MaxFlowForm({ SendToParent }) {
  const [startNodes, setStartNodes] = useState('');
  const [endNodes, setEndNodes] = useState('');
  const [capacities, setCapacities] = useState('');
  const [source, setSource] = useState('');
  const [sink, setSink] = useState('');

  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      let parsedInputData;
      try {
        parsedInputData = JSON.parse(text);
        setStartNodes(JSON.stringify(parsedInputData.StartNodes, null, 2) || '');
        setEndNodes(JSON.stringify(parsedInputData.EndNodes, null, 2) || '');
        setCapacities(JSON.stringify(parsedInputData.Capacities, null, 2) || '');
        setSource(parsedInputData.Source || 0);
        setSink(parsedInputData.Sink || 0);
      } catch (error) {
        alert('Input Data is not a valid JSON object');
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleClick = () => {
    let parsedStartNodes, parsedEndNodes, parsedCapacities;
    try {
      parsedStartNodes = JSON.parse(startNodes);
      parsedEndNodes = JSON.parse(endNodes);
      parsedCapacities = JSON.parse(capacities);
    } catch (error) {
      alert('Error parsing input fields. Ensure all inputs are correctly formatted JSON arrays.');
      return;
    }

    if (!Array.isArray(parsedStartNodes) || !Array.isArray(parsedEndNodes) || !Array.isArray(parsedCapacities)) {
      alert('Start nodes, end nodes, and capacities must be arrays.');
      return;
    }

    if (parsedStartNodes.length !== parsedEndNodes.length || parsedStartNodes.length !== parsedCapacities.length) {
      alert('Start nodes, end nodes, and capacities arrays must have the same length.');
      return;
    }

    if (isNaN(source) || isNaN(sink)) {
      alert('Source and sink must be valid numbers.');
      return;
    }

    const formData = {
      StartNodes: parsedStartNodes,
      EndNodes: parsedEndNodes,
      Capacities: parsedCapacities,
      Source: parseInt(source, 10),
      Sink: parseInt(sink, 10),
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
        Start Nodes (JSON Array):
        <textarea rows="5" cols="50" value={startNodes} onChange={(e) => setStartNodes(e.target.value)} />
      </label>
      <label>
        End Nodes (JSON Array):
        <textarea rows="5" cols="50" value={endNodes} onChange={(e) => setEndNodes(e.target.value)} />
      </label>
      <label>
        Capacities (JSON Array):
        <textarea rows="5" cols="50" value={capacities} onChange={(e) => setCapacities(e.target.value)} />
      </label>
      <label>
        Source Node:
        <input type="number" value={source} onChange={(e) => setSource(e.target.value)} />
      </label>
      <label>
        Sink Node:
        <input type="number" value={sink} onChange={(e) => setSink(e.target.value)} />
      </label>
      <button type="button" onClick={handleClick}>Check Data</button>
    </div>
  );
}

export default MaxFlowForm;