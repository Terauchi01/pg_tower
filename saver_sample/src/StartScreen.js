import React, { useState } from 'react';
import { Link } from 'react-router-dom';

function StartScreen() {
    const [message, setMessage] = useState('');

    const handleInputMessage = (event) => {
        setMessage(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        console.log('送信されたメッセージ:', message);

        fetch('/saver/api/send-message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message
            })
        })
        .then(response => response.json())
        .then(data => console.log(data))
        .catch(error => console.error(error));
    };

    return (
        <div>
            <h1>StartScreen</h1>
            <form onSubmit={handleSubmit}>
                <input type="text" value={message} onChange={handleInputMessage} />
                <button type="submit">送信</button>
            </form>
            <ul>
                <li><Link to="/home">home</Link></li>
                <li><Link to="/room-match">Room Match</Link></li>
                <li><Link to="/room-password">Room Password</Link></li>
                <li><Link to="/cpu-battle">CPU Battle</Link></li>
                <li><Link to="/battle">Battle</Link></li>
                <li><Link to="/result">Result</Link></li>
            </ul>
        </div>
    );
}

export default StartScreen;
