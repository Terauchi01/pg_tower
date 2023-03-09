import React from 'react';

import { Link } from 'react-router-dom';

class CPUBattle extends React.Component {
    
}
  
function Navigation() {
  return (
    <ul>
      <li>
        <Link to="/">CPUBattle</Link>
      </li>
      <li>
        <Link to="/about">About</Link>
      </li>
    </ul>
  );
}

export default CPUBattle;
