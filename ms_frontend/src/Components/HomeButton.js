// HomeButton.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // import the CSS file

function HomeButton() {
  return (
    <Link to="/"><button className='home-button'>Home</button></Link>
  );
}

export default HomeButton;