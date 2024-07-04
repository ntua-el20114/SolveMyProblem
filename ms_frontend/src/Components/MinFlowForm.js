import React, { useState } from 'react';
import '../index.css';

function MinFlowForm({ SendToParent }) {
  const [StartNodes, setStartNodes] = useState('');
  const [EndNodes, setEndNodes] = useState('');
  const [Capacities, setCapacities] = useState('');
  const [UnitCosts, setUnitCosts] = useState('');
  const [Supplies, setSupplies] = useState('');

  const handleFileChange = async (e) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = (e.target.result);
      let parsedInputData;
      try {
        parsedInputData = JSON.parse(text);
        setStartNodes(parsedInputData.StartNodes || []);
        setEndNodes(parsedInputData.EndNodes || []);
        setCapacities(parsedInputData.Capacities || []);
        setUnitCosts(parsedInputData.UnitCosts || []);
        setSupplies(parsedInputData.Supplies || []);
      } catch (error) {
        alert('Input Data is not a valid JSON object');
        return;
      }
    };
    try{
    reader.readAsText(e.target.files[0]);
    }
    catch (error) {
        console.error('Error reading file:', error);
        alert('Error reading file');
        return;
    }  
  };

  const handleClick = () => {
    if (!Array.isArray(StartNodes) || !Array.isArray(EndNodes) || !Array.isArray(Capacities) || !Array.isArray(UnitCosts) || !Array.isArray(Supplies)) {
      alert('All inputs must be arrays.');
      return;
    }

    if (StartNodes.length !== EndNodes.length || StartNodes.length !== Capacities.length || StartNodes.length !== UnitCosts.length) {
      alert('Start nodes, end nodes, capacities, and unit costs arrays must have the same length.');
      return;
    }

    const formData = {
      StartNodes: StartNodes,
      EndNodes: EndNodes,
      Capacities: Capacities,
      UnitCosts: UnitCosts,
      Supplies: Supplies,
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
        Start Nodes:
        <textarea rows="5" cols="50" value={StartNodes} onChange={(e) => setStartNodes(e.target.value)} />
      </label>
      <label>
        End Nodes:
        <textarea rows="5" cols="50" value={EndNodes} onChange={(e) => setEndNodes(e.target.value)} />
      </label>
      <label>
        Capacities:
        <textarea rows="5" cols="50" value={Capacities} onChange={(e) => setCapacities(e.target.value)} />
      </label>
      <label>
        Unit Costs:
        <textarea rows="5" cols="50" value={UnitCosts} onChange={(e) => setUnitCosts(e.target.value)} />
      </label>
      <label>
        Supplies:
        <textarea rows="5" cols="50" value={Supplies} onChange={(e) => setSupplies(e.target.value)} />
      </label>
      <br />
      <button type="button" onClick={handleClick}>Check Data</button>
    </div>
  );
}

export default MinFlowForm;