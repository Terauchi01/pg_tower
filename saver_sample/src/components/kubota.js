export function draw(context, width, height) {
    context.beginPath();
    context.arc(width / 2, height / 2, 50, 0, 2 * Math.PI);
    context.fillStyle = "red";
    context.fill();
  }
  
  export function animate(context, width, height) {
    let x = 0;
    let y = 0;
    let dx = 1;
    let dy = 1;
  
    function drawFrame() {
      // Clear canvas
      context.clearRect(0, 0, width, height);
  
      // Draw circle at current position
      context.beginPath();
      context.arc(x, y, 50, 0, 2 * Math.PI);
      context.fillStyle = "red";
      context.fill();
  
      // Update position
      x += dx;
      y += dy;
  
      // Reverse direction if circle hits edge of canvas
      if (x < 50 || x > width - 50) {
        dx = -dx;
      }
      if (y < 50 || y > height - 50) {
        dy = -dy;
      }
  
      // Request next frame
      requestAnimationFrame(drawFrame);
    }
  
    // Start animation
    drawFrame();
  }
  