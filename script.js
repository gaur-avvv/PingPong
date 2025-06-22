const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Resize the canvas to fit the window size
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Audio elements
const jumpSound = document.getElementById('jumpSound');
const gameOverSound = document.getElementById('gameOverSound');

let buffalo = {
  x: 50,
  y: canvas.height - 150,
  width: 50,
  height: 50,
  dx: 2, // Speed in X direction
  dy: 0, // Speed in Y direction (gravity will affect this)
  jumpHeight: -15, // Jump strength
  gravity: 0.5,
  isJumping: false,
};

let obstacles = [];
let obstacleSpeed = 3;
let gameOver = false;

function drawBuffalo() {
  ctx.fillStyle = "brown"; // Buffalo color
  ctx.fillRect(buffalo.x, buffalo.y, buffalo.width, buffalo.height);
}

function moveBuffalo() {
  if (buffalo.isJumping) {
    buffalo.dy += buffalo.gravity; // Apply gravity
    buffalo.y += buffalo.dy;
    
    // Land on the ground
    if (buffalo.y > canvas.height - buffalo.height - 100) {
      buffalo.y = canvas.height - buffalo.height - 100;
      buffalo.isJumping = false;
      buffalo.dy = 0;
    }
  }
}

function drawObstacles() {
  ctx.fillStyle = "red";
  for (let i = 0; i < obstacles.length; i++) {
    ctx.fillRect(obstacles[i].x, obstacles[i].y, obstacles[i].width, obstacles[i].height);
    obstacles[i].x -= obstacleSpeed; // Move obstacles to the left
    if (obstacles[i].x + obstacles[i].width < 0) {
      obstacles.splice(i, 1); // Remove off-screen obstacles
      i--;
    }
    
    // Check for collision with the buffalo
    if (buffalo.x < obstacles[i].x + obstacles[i].width &&
        buffalo.x + buffalo.width > obstacles[i].x &&
        buffalo.y < obstacles[i].y + obstacles[i].height &&
        buffalo.y + buffalo.height > obstacles[i].y) {
      gameOver = true;
      gameOverSound.play();  // Play game over sound
    }
  }
}

function spawnObstacle() {
  let height = Math.random() * 50 + 30;
  obstacles.push({
    x: canvas.width,
    y: canvas.height - height - 100,
    width: 20,
    height: height,
  });
}

// Main game loop
function gameLoop() {
  if (gameOver) {
    // Stop game loop when game is over
    ctx.font = "30px Arial";
    ctx.fillStyle = "white";
    ctx.fillText("Game Over!", canvas.width / 2 - 100, canvas.height / 2);
    return; 
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  drawBuffalo();
  moveBuffalo();
  drawObstacles();
  
  requestAnimationFrame(gameLoop);
}

// Handle key presses for jump
document.addEventListener("keydown", function (event) {
  if (event.code === "Space" && !buffalo.isJumping) {
    buffalo.isJumping = true;
    buffalo.dy = buffalo.jumpHeight;
    jumpSound.play();  // Play jump sound when jumping
  }
});

// Spawn obstacles every 2 seconds
setInterval(spawnObstacle, 2000);

// Start the game
gameLoop();
