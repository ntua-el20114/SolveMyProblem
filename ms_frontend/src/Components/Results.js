// Results.js
import React, { useState, useEffect } from 'react';
import Header from './Header';
import '../index.css'; // import the CSS file
import path from 'path';
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function Results() {
  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  // selectedResult = JSON.parse(selectedResult)

  useEffect(() => {
    fetchResults();
  }, []);

  const fetchResults = async () => {
    try {
      const response = await fetch(`http://0.0.0.0:3005/results`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      setResults(data); // Update the state with the fetched results
    } catch (error) {
      console.error('Error fetching results:', error);
    }
  };

  function downloadJson(result, mode) {
    // Define file name and content
    let name = result.problemName + "_" + mode + ".json";
    console.log("Downloading", name);
    let jsonObject = {};
    switch (mode){
      case "input":
        jsonObject = result.problemInput;
        break;
      case "output":
        jsonObject = result.problemOutput;
        break;
      default:
        break;
    }

    // Download the file
    console.log(jsonObject);
    const blob = new Blob([jsonObject], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    // Create an anchor element and trigger the download
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a); // Append the anchor to the body to make it clickable
    a.click(); // Programmatically click the anchor to trigger the download

    // Clean up by revoking the Blob URL and removing the anchor from the body
    URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  return (
    <div>
      <Header />
    <h1 className="left-to-right-slow center-screen">Results</h1>
    <div style={{ display: 'flex', flexDirection: 'row' , paddingBottom:"20px"}}>
      <div style={{ flex: 1, marginRight:'20px', marginLeft:'20px', justifyContent: 'center', alignItems: 'center'}} className='results'>
        <h1 className="left-to-right-slow center-screen">Problems</h1>
        <div className='scrollbox'>
          <ul>
            {results.map((result, index) => (
              <li key={index} onClick={() => setSelectedResult(result)}>
                {result.problemName}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <div style={{ flex: 2 }}>
        {selectedResult ? (
          <div>
            <h1 className="center-screen">{selectedResult.problemName}</h1>
            {displayResults(selectedResult.problemOutput, selectedResult.solver)}
            <p style={{ color:"white" }}><b>Time processed:</b> {selectedResult.solveTime} ms</p>
            <div style={{display:"flex", alignItems:'justify'}}>
              <button type="button" onClick={() => downloadJson(selectedResult, "input")}>Input File</button>
              &nbsp;&nbsp;&nbsp;
              <button type="button" onClick={() => downloadJson(selectedResult, "output")}>Output File</button>
            </div>
          </div>
        ) : (
          <h1 className="left-to-right-slow center-screen">Select a problem</h1>
        )}
      </div>
    </div>
    </div>
  );
}

function displayResults(result, type){
  
  // Handle Errors and Failures
  if (result.Result === "Error"){
    return (
      <div>
        <h2 style={{color:'#ff5452'}}>Error</h2>  
        <p style={{color:'white'}}>The solver encountered an error while attempting this problem:<br/>
        <i>{result.Message}</i>
        </p>
      </div>
  )
  }
  if (result.Result === "Failure"){
    return (
    <div>
      <h2 style={{color:'#ffad43'}}>Failure</h2>
      <p style={{color:'white'}}>The solver was unable to find a solution.</p>
    </div>)
  }

  // Determine type of problem
  let data = (<div></div>);
  switch (type){
    case "Routing - VRP":
      data = (
        <div style={{color:"white"}}>
          <p style={{color:"white"}}>The solver found a solution.</p>
          <p style={{color:"white"}}>
            <b>Routes:</b> {
              Array.from({ length: result.Routes.length }, (_, i) => (
                <React.Fragment key={i}>
                  <div style={{marginBottom: '5px'}}>
                  {`Vehicle ${i}: ${JSON.stringify(result.Routes[i].Route)}`}<br/>
                  { `Distance: ${JSON.stringify(result.Routes[i].Distance)}`}
                  </div>
                </React.Fragment>
              ))
            }
          </p>
          <p style={{color:"white"}}>
            <b>Longest route distance:</b> {result.MaxRouteDistance}<br/>
            <b>Total distance:</b> {result.TotalDistance}<br/>
          </p>
        </div>);
      break;
    case "Routing - CVRP":
      data = (
        <div style={{color:"white"}}>
          <p style={{color:"white"}}>The solver found a solution.</p>
          <p style={{color:"white"}}>
            <b>Routes:</b> {
              Array.from({ length: result.Routes.length }, (_, i) => (
                <React.Fragment key={i}>
                  <div style={{marginBottom: '5px'}}>
                  {`Vehicle ${i}: ${JSON.stringify(result.Routes[i].Route)}`}<br/>
                  { `Distance: ${JSON.stringify(result.Routes[i].Distance)}`}<br/>
                  { `Load: ${JSON.stringify(result.Routes[i].Load)}`}
                  </div>
                </React.Fragment>
              ))
            }
          </p>
          <p style={{color:"white"}}>
            <b>Longest route distance:</b> {result.MaxRouteDistance}<br/>
            <b>Total distance:</b> {result.TotalDistance}<br/>
            <b>Largest route load:</b> {result.MaxRouteLoad}<br/>
            <b>Total load:</b> {result.TotalLoad}<br/>
          </p>
        </div>);
      break;
    case "Routing - VRPTW":
      data = (
        <div style={{color:"white"}}>
          <p style={{color:"white"}}>The solver found a solution.</p>
          <p style={{color:"white"}}>
            <b>Routes:</b> {
              Array.from({ length: result.Routes.length }, (_, i) => (
                <React.Fragment key={i}>
                  <div style={{marginBottom: '5px'}}>
                  {`Vehicle ${i}: ${JSON.stringify(result.Routes[i].Route)}`}<br/>
                  { `Time windows: ${JSON.stringify(result.Routes[i].TimeWindows)}`}<br/>
                  { `Total time: ${JSON.stringify(result.Routes[i].Time)}`}
                  </div>
                </React.Fragment>
              ))
            }
          </p>
          <p style={{color:"white"}}>
            <b>Longest route time:</b> {result.MaxRouteTime}<br/>
            <b>Total time:</b> {result.TotalTime}<br/>
          </p>
        </div>);
      break;
    case "Max Flow":
      data = (
        <div style={{color:"white"}}>
          <p style={{color:"white"}}>The solver found {result.Optimal ? "an optimal" : "a non optimal"} solution.</p>
          <p style={{color:"white"}}>
            <b>Maximum flow:</b> {result.MaxFlow}<br/>
            <b>Source side min cut:</b> {JSON.stringify(result.SourceSideMinCut)}<br/>
            <b>Sink side min cut:</b> {JSON.stringify(result.SinkSideMinCut)}<br/>
            <b>Arc flows: </b> {JSON.stringify(result.ArcFlows)}
          </p>
        </div>);
      break;
    case "Min Cost Flow":
      data = (
        <div style={{color:"white"}}>
          <p style={{color:"white"}}>The solver found {result.Optimal ? "an optimal" : "a non optimal"} solution.</p>
          <p style={{color:"white"}}>
            <b>Total cost:</b> {result.MinCost}<br/>
            <b>Arc flows:</b> {JSON.stringify(result.ArcFlows)}<br/>
            <b>Arc costs:</b> {JSON.stringify(result.ArcCosts)}
          </p>
        </div>);
      break;
    case "Employee Scheduling":
      data = (
        <div style={{color:"white"}}>
          <p style={{color:"white"}}>The solver found {result.Optimal ? "an optimal" : "a non optimal"} solution.</p>
          <p style={{color:"white"}}>
            <b>Assigned shifts:</b> {
              Array.from({ length: result.Solution.length }, (_, i) => (
                <React.Fragment key={i}>
                  <br/>
                  {`Day ${i}: ${JSON.stringify(result.Solution[i])}`}
                </React.Fragment>
              ))
            }
          </p>
          <p style={{color:"white"}}>
            <b>Requests met:</b> {result.RequestsMet}<br/>
            <div style={{display:"flex"}}>
            <b>Confilcts:</b> {result.Conflicts}&nbsp;&nbsp;
              <div style={{color:"gray", fontStyle:"italic",paddingBottom:"5px"}}>Times the solver tried to assign a value to a variable, that would violate a castraint. Portrays the complexity of the problem.</div>
            </div>
            <b>Branches: </b> {result.Branches}
          </p>
        </div>);
      break;
    case "Scheduling - Job Shop":
      data = (
        <div style={{color:"white"}}>
          <p style={{color:"white"}}>The solver found {result.Optimal ? "an optimal" : "a non optimal"} solution.</p>
          <p style={{color:"white"}}>
            <b>Assigned tasks:</b> {
              Array.from({ length: result.Solution.length }, (_, i) => {
                // Sort jobs by start time for each machine
                const sortedTasks = result.Solution[i].sort((a, b) => a.start - b.start);
                let tasks = sortedTasks.map(task => `job_${task.job}_task_${task.index}`)
                let durations = sortedTasks.map(task => `${task.start}-${task.start + task.duration}`)

                return (
                  <React.Fragment key={i}>
                    <div style={{marginBottom: '5px'}}>
                    {`Machine ${i}: ${JSON.stringify(tasks)}`}<br/>
                    { `Durations: ${JSON.stringify(durations)}`}<br/>
                    </div>
                  </React.Fragment>
                )
              })
            }
          </p>
          <p style={{color:"white"}}>
            <b>Total duration:</b> {result.Makespan}<br/>
            <div style={{display:"flex"}}>
            <b>Confilcts:</b> {result.Conflicts}&nbsp;&nbsp;
              <div style={{color:"gray", fontStyle:"italic",paddingBottom:"5px"}}>Times the solver tried to assign a value to a variable, that would violate a castraint. Portrays the complexity of the problem.</div>
            </div>
            <b>Branches: </b> {result.Branches}
          </p>
        </div>);
      break;
    default:
      data = (<div style={{color:"white"}}>Unrecogised problem. At least the solver solved it ¯\_(ツ)_/¯</div>);
      break;
  }
  return (
    <div>
      <h2 style={{color:'#3cff4a'}}>Success</h2>
      {data}
    </div>
    )
}

export default Results;