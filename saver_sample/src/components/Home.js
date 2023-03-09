import { Link } from 'react-router-dom';

function Home() {
  return (
    <div>
      <h1>Welcome to the Home page!</h1>
      <p>Click on the links below to navigate to other pages:</p>
      <ul>
        <li><Link to="/room-match">Room Match</Link></li>
        <li><Link to="/cpu-battle">CPU Battle</Link></li>
      </ul>
    </div>
  );
}

export default Home;