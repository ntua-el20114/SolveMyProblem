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
      <div className="qLinks">
      <Link to="/problems" className="qLink">
        <img src="/problems.png" alt=""/>
        <p className="qTitle">Problems</p>
        <p className="qSubtitle">Display all the problems and add new!</p>
      </Link>
      <Link to="/results" className="qLink">
        <img src="/results.png" alt=""/>
        <p className="qTitle">Results</p>
        <p className="qSubtitle">Get results from solved problems!</p>
      </Link>
      <Link to="/analytics" className="qLink">
        <img src="/analytics.png" alt=""/>
        <p className="qTitle">Analytics</p>
        <p className="qSubtitle">Watch the analytics of problem submission!</p>
      </Link>
      </div>
    </div>
    
  );
}

export default Home;