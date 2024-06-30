import React, { useState } from 'react';
import '../index.css';

function MinFlowForm({ SendToParent }) {
  const [startNodes, setStartNodes] = useState('');
  const [endNodes, setEndNodes] = useState('');
  const [capacities, setCapacities] = useState('');
  const [unitCosts, setUnitCosts] = useState('');
  const [supplies, setSupplies] = useState('');

  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      let parsedInputData;
      try {
        parsedInputData = JSON.parse(text);
        setStartNodes(JSON.stringify(parsedInputData.start_nodes, null, 2) || '');
        setEndNodes(JSON.stringify(parsedInputData.end_nodes, null, 2) || '');
        setCapacities(JSON.stringify(parsedInputData.capacities, null, 2) || '');
        setUnitCosts(JSON.stringify(parsedInputData.unit_costs, null, 2) || '');
        setSupplies(JSON.stringify(parsedInputData.supplies, null, 2) || '');
      } catch (error) {
        alert('Input Data is not a valid JSON object');
      }
    };
    reader.readAsText(e.target.files[0]);
  };

  const handleSubmit = () => {
    let parsedStartNodes, parsedEndNodes, parsedCapacities, parsedUnitCosts, parsedSupplies;
    try {
      parsedStartNodes = JSON.parse(startNodes);
      parsedEndNodes = JSON.parse(endNodes);
      parsedCapacities = JSON.parse(capacities);
      parsedUnitCosts = JSON.parse(unitCosts);
      parsedSupplies = JSON.parse(supplies);
    } catch (error) {
      alert('Error parsing input fields. Ensure all inputs are correctly formatted JSON arrays.');
      return;
    }

    if (!Array.isArray(parsedStartNodes) || !Array.isArray(parsedEndNodes) || !Array.isArray(parsedCapacities) || !Array.isArray(parsedUnitCosts) || !Array.isArray(parsedSupplies)) {
      alert('All inputs must be arrays.');
      return;
    }

    if (parsedStartNodes.length !== parsedEndNodes.length || parsedStartNodes.length !== parsedCapacities.length || parsedStartNodes.length !== parsedUnitCosts.length) {
      alert('Start nodes, end nodes, capacities, and unit costs arrays must have the same length.');
      return;
    }

    const formData = {
      start_nodes: parsedStartNodes,
      end_nodes: parsedEndNodes,
      capacities: parsedCapacities,
      unit_costs: parsedUnitCosts,
      supplies: parsedSupplies,
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
        The Minimum Cost Flow problem is a form of a flow problem, where each edge has a unit cost for
        transporting material across it ("UnitCosts"). Here, each node can have a supply or demand of material ("Supplies", negative values indicate demands).
        The problem is to find a flow with the least total cost.
      </p>
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
        Unit Costs (JSON Array):
        <textarea rows="5" cols="50" value={unitCosts} onChange={(e) => setUnitCosts(e.target.value)} />
      </label>
      <label>
        Supplies (JSON Array):
        <textarea rows="5" cols="50" value={supplies} onChange={(e) => setSupplies(e.target.value)} />
      </label>
      <br />
      <button type="button" onClick={handleSubmit}>Check Data</button>
    </div>
  );
}

export default MinFlowForm;