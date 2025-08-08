const gameArea = document.getElementById("game-area");
const character = document.getElementById("character");
const gameOverText = document.getElementById("game-over");
const playBtn = document.getElementById('play-btn');
const quickBtn = document.getElementById('quick-btn');


let isPlaying = false;
let isJumping = false;
let isGameOver = false;
let obstacleTimeoutId = null;
let score = 0;
let scoreIntervalId = null;

const scoreElement = document.getElementById('score');

// Update score display
function updateScore() {
  scoreElement.textContent = `Score: ${score}`;
}

function spawnObstacles() {
  if (isGameOver) {
    if (obstacleTimeoutId) {
      clearTimeout(obstacleTimeoutId);
      obstacleTimeoutId = null;
    }
    return;
  }

  const obstacleText = ['family', 'work', 'taxes', 'rent', 'chores', 'emails', 'bills', 'debt'];
  const index = Math.floor(Math.random() * obstacleText.length);
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.innerHTML = obstacleText[index];
  obstacle.style.right = "-30px";
  gameArea.appendChild(obstacle);

  obstacle.addEventListener("animationend", () => {
    obstacle.remove();
  });

  const delay = Math.random() * 3000 + 3000;
  obstacleTimeoutId = setTimeout(spawnObstacles, delay);
}

function onJump(e) {
  if ((e.code === "Space" || e.key === " ") && !isJumping && !isGameOver) {
    isJumping = true;
    character.classList.add("jump");
    setTimeout(() => {
      character.classList.remove("jump");
      isJumping = false;
    }, 800);
  }
}

const checkCollision = setInterval(() => {
  if (isGameOver) return;

  const characterRect = character.getBoundingClientRect();
  const obstacles = document.querySelectorAll(".obstacle");

  obstacles.forEach(obstacle => {
    const obsRect = obstacle.getBoundingClientRect();

    if (
      characterRect.left < obsRect.left + obsRect.width &&
      characterRect.left + characterRect.width > obsRect.left &&
      characterRect.bottom > obsRect.top
    ) {
      endGame()
    }
  });
}, 10);


function resetGame() {
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach(o => o.remove());

  isGameOver = false;
  isJumping = false;
  isPlaying = false;

  gameOverText.style.display = 'none';
  gameArea.classList.remove('playing');
}

function startGame() {
  // Hide Quick Restart button
quickBtn.style.display = 'none';

  if (isPlaying) return;

  isPlaying = true;
  isGameOver = false;

  gameArea.classList.add('playing');
  document.addEventListener("keydown", onJump);

  spawnObstacles();
  // Reset and start score counter
  score = 0;
  updateScore();
  scoreIntervalId = setInterval(() => {
  if (!isGameOver) {
    score++;
    updateScore();
  }
}, 500); // Increase score every 0.5s

}

function endGame() {
  isGameOver = true;
  isPlaying = false;

  if (obstacleTimeoutId) {
    clearTimeout(obstacleTimeoutId);
    obstacleTimeoutId = null;
  }

  document.removeEventListener("keydown", onJump);

  gameArea.classList.remove('playing');
  gameOverText.style.display = 'block';

  // Stop obstacles
  const obstacles = document.querySelectorAll(".obstacle");
  obstacles.forEach(o => {
    o.style.animationPlayState = "paused";
  });

  // Stop score counter
 if (scoreIntervalId) {
  clearInterval(scoreIntervalId);
  scoreIntervalId = null;
}

// Show Quick Restart button
quickBtn.style.display = 'inline-block';


}

playBtn.addEventListener('click', () => {
  gameOverText.style.display = 'none';
  resetGame()
  startGame();

  // Reset score display
  score = 0;
  updateScore();
  
});

// Quick Restart button logic
quickBtn.addEventListener('click', () => {
  gameOverText.style.display = 'none';
  resetGame();
  startGame();
});
