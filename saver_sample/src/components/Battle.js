import React from 'react';
import { Link } from 'react-router-dom';

function CPUBattle() {
    return (
        <div>
            <h1>Battle</h1>
            <ul>
                <li><Link to="/">StartScreen</Link></li>
                <li><Link to="/home">Room Match</Link></li>
                <li><Link to="/room-match">Room Match</Link></li>
                <li><Link to="/room-password">Room Password</Link></li>
                <li><Link to="/cpu-battle">CPU Battle</Link></li>
                <li><Link to="/battle">Battle</Link></li>
                <li><Link to="/result">Result</Link></li>
            </ul>
        </div>
    );
}


export default CPUBattle;