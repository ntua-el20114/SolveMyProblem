// Header.js
import React from 'react';
import { Link } from 'react-router-dom';
import '../index.css'; // import the CSS file

function Header({ showHomeButton = true }) {
  return (
    <div className='header'>
      {showHomeButton && <Link to="/" style={{position: 'absolute', top: '10px', left: '10px'}}><img src="/home_icon.png" alt="Home" style={{width: '50px', height: '50px'}} className='left-to-right-fast home-button'/></Link>}
      <img src="/logo_transparent.png" alt="Logo" style={{marginTop: '10px',width: '220px', height: '110px', animation: 'bounceIn 1.5s'}} />
    </div>
  );
}

export default Header;