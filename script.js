const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

// Game settings
const PADDLE_WIDTH = 15;
const PADDLE_HEIGHT = 100;
const BALL_SIZE = 15;
const PADDLE_MARGIN = 20;
const PLAYER_PADDLE_COLOR = "#4CAF50";
const AI_PADDLE_COLOR = "#F44336";
const BALL_COLOR = "#FFD600";
const NET_COLOR = "#fff";

let playerY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let aiY = canvas.height / 2 - PADDLE_HEIGHT / 2;
let ballX = canvas.width / 2 - BALL_SIZE / 2;
let ballY = canvas.height / 2 - BALL_SIZE / 2;
let ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
let ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);

let playerScore = 0;
let aiScore = 0;

// Mouse movement controls player paddle
canvas.addEventListener('mousemove', function(evt) {
  const rect = canvas.getBoundingClientRect();
  const root = document.documentElement;
  let mouseY = evt.clientY - rect.top - root.scrollTop;
  playerY = mouseY - PADDLE_HEIGHT / 2;
  // Clamp paddle inside canvas
  playerY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, playerY));
});

function drawNet() {
  ctx.strokeStyle = NET_COLOR;
  ctx.setLineDash([8, 16]);
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2, 0);
  ctx.lineTo(canvas.width / 2, canvas.height);
  ctx.stroke();
  ctx.setLineDash([]);
}

function drawPaddle(x, y, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, PADDLE_WIDTH, PADDLE_HEIGHT);
}

function drawBall(x, y, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x + BALL_SIZE / 2, y + BALL_SIZE / 2, BALL_SIZE / 2, 0, Math.PI * 2);
  ctx.fill();
}

function drawScore() {
  ctx.font = "30px Arial";
  ctx.fillStyle = "#fff";
  ctx.fillText(playerScore, canvas.width / 4, 40);
  ctx.fillText(aiScore, 3 * canvas.width / 4, 40);
}

function resetBall() {
  ballX = canvas.width / 2 - BALL_SIZE / 2;
  ballY = canvas.height / 2 - BALL_SIZE / 2;
  ballSpeedX = 5 * (Math.random() > 0.5 ? 1 : -1);
  ballSpeedY = 4 * (Math.random() > 0.5 ? 1 : -1);
}

function aiMove() {
  // Center of AI paddle
  let aiCenter = aiY + PADDLE_HEIGHT / 2;
  let ballCenter = ballY + BALL_SIZE / 2;
  // Simple AI: Move towards the ball, with a max speed
  let aiSpeed = 5;
  if (aiCenter < ballCenter - 20) {
    aiY += aiSpeed;
  } else if (aiCenter > ballCenter + 20) {
    aiY -= aiSpeed;
  }
  // Clamp AI paddle inside canvas
  aiY = Math.max(0, Math.min(canvas.height - PADDLE_HEIGHT, aiY));
}

function updateBall() {
  ballX += ballSpeedX;
  ballY += ballSpeedY;

  // Top / bottom wall collision
  if (ballY <= 0 || ballY + BALL_SIZE >= canvas.height) {
    ballSpeedY = -ballSpeedY;
  }

  // Left paddle collision
  if (
    ballX <= PADDLE_MARGIN + PADDLE_WIDTH &&
    ballY + BALL_SIZE > playerY &&
    ballY < playerY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -ballSpeedX;
    // Add some randomness based on where it hit the paddle
    let hitPos = (ballY + BALL_SIZE / 2 - (playerY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballSpeedY += hitPos * 3;
    ballX = PADDLE_MARGIN + PADDLE_WIDTH; // Prevent sticking
  }

  // Right paddle collision (AI)
  if (
    ballX + BALL_SIZE >= canvas.width - PADDLE_MARGIN - PADDLE_WIDTH &&
    ballY + BALL_SIZE > aiY &&
    ballY < aiY + PADDLE_HEIGHT
  ) {
    ballSpeedX = -ballSpeedX;
    let hitPos = (ballY + BALL_SIZE / 2 - (aiY + PADDLE_HEIGHT / 2)) / (PADDLE_HEIGHT / 2);
    ballSpeedY += hitPos * 3;
    ballX = canvas.width - PADDLE_MARGIN - PADDLE_WIDTH - BALL_SIZE; // Prevent sticking
  }

  // Score update
  if (ballX < 0) {
    aiScore++;
    resetBall();
  } else if (ballX + BALL_SIZE > canvas.width) {
    playerScore++;
    resetBall();
  }
}

function draw() {
  // Clear canvas
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawNet();
  drawPaddle(PADDLE_MARGIN, playerY, PLAYER_PADDLE_COLOR);
  drawPaddle(canvas.width - PADDLE_MARGIN - PADDLE_WIDTH, aiY, AI_PADDLE_COLOR);
  drawBall(ballX, ballY, BALL_COLOR);
  drawScore();
}

function gameLoop() {
  aiMove();
  updateBall();
  draw();
  requestAnimationFrame(gameLoop);
}

gameLoop();