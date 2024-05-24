// Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import Header from './Header';
import '../index.css'; // import the CSS file

function Home() {
  return (
    <div>
      <Header showHomeButton={false} />
      <br />
      <Link to="/problems"><button>Problems</button></Link>
      <Link to="/results"><button>Results</button></Link>
      <Link to="/analytics"><button>Analytics</button></Link>
    </div>
  );
}

export default Home;