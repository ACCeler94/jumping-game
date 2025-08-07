export function spawnObstacles(isGameOver, gameArea) {
  console.log(gameArea)
  const obstacleText = ['Family', 'Work', 'Taxes', 'Rent', 'Chores', 'Emails', 'Bills', 'Debt'];

  if (isGameOver) return;

  const index = Math.floor(Math.random() * obstacleText.length)
  const obstacle = document.createElement("div");
  obstacle.classList.add("obstacle");
  obstacle.innerHTML = obstacleText[index]
  obstacle.style.right = "-30px";
  gameArea.appendChild(obstacle);

  // Remove when animation ends
  obstacle.addEventListener("animationend", () => {
    obstacle.remove();
  });

  // New obstacle every 1-3s
  const delay = Math.random() * 2000 + 1000;
  const timeout = setTimeout(() => spawnObstacles(isGameOver, gameArea), delay);
}