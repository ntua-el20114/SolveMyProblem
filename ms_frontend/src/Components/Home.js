// Home.js
import React from 'react';
import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to our app!</h1>
      <p>Navigate to the other pages:</p>
      <Link to="/problems"><button>Go to Problems</button></Link>
      <Link to="/results"><button>Go to Results</button></Link>
      <Link to="/analytics"><button>Go to Analytics</button></Link>
    </div>
  );
}

export default Home;