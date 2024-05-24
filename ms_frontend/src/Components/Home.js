// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // import the CSS file

function Home() {
  return (
    <div>
      <div style={{display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center'}}>
        <img src="/logo_transparent.png" alt="Logo" style={{width: '300px', height: '150px', }} />
      </div>
      <br />
      <Link to="/problems"><button>Go to Problems</button></Link>
      <Link to="/results"><button>Go to Results</button></Link>
      <Link to="/analytics"><button>Go to Analytics</button></Link>
    </div>
  );
}

export default Home;