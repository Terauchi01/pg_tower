import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import {draw, animate} from './kubota.js';

function CPUBattle() {
  const canvasRef = useRef(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    function drawFrame() {
      // Clear canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Draw circle at new position
      const x = (canvas.width / 2) + 100 * Math.sin(Date.now() / 1000);
      const y = (canvas.height / 2) + 100 * Math.cos(Date.now() / 1000);
      draw(context, x, y);

      if (isAnimating) {
        // Request next frame
        requestAnimationFrame(drawFrame);
      }
    }

    if (isAnimating) {
      // Start animation
      requestAnimationFrame(drawFrame);
    }

    // Cleanup
    return () => {
      setIsAnimating(false);
    };
  }, [isAnimating]);

  return (
    <div>
      <h1>CPUBattle</h1>
      <ul>
        <li><Link to="/">StartScreen</Link></li>
        <li><Link to="/home">Room Match</Link></li>
        <li><Link to="/room-match">Room Match</Link></li>
        <li><Link to="/room-password">Room Password</Link></li>
        <li><Link to="/cpu-battle">CPU Battle</Link></li>
        <li><Link to="/battle">Battle</Link></li>
        <li><Link to="/result">Result</Link></li>
      </ul>
      <canvas id="myCanvas" ref={canvasRef}
        onMouseEnter={() => setIsAnimating(true)}
        onMouseLeave={() => setIsAnimating(false)}></canvas>
    </div>
  );
}

export default CPUBattle;
