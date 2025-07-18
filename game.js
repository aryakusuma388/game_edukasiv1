const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const gridSize = 40;
let robotX = 0, robotY = 0;
let finishX = 0, finishY = 0;
let commands = [];
let currentLevel = 1;
let imagesLoaded = 0;

const robotImg = new Image();
robotImg.src = "icon/murid.png";

const brokenRobotImg = new Image();
brokenRobotImg.src = "icon/sekolah.png";

const obstacleImg = new Image();
obstacleImg.src = "icon/dinding.png";


robotImg.onload = imageLoaded;
brokenRobotImg.onload = imageLoaded;

function imageLoaded() {
  imagesLoaded++;
  if (imagesLoaded === 2) {
    setLevel(1);
  }
}

const levels = {
  1: { start: [0, 0], goal: [6, 2], obstacles: [] },
  2: { start: [0, 0], goal: [3, 5], obstacles: [[0, 3],[0, 4],[0, 5],[0, 6],[0, 7],[1, 1],[1, 7],[2, 1],[2, 2],[2, 3],[2, 4],[2, 5],[2, 7],[3, 7],[4, 0],[4, 1],[4, 2],[4, 3],[4, 4],[4, 5],[4, 6],[4, 7]] },
  3: {
    start: [2, 0],
    goal: [0, 6],
    obstacles: [[1, 1], [1, 2], [1, 3],[1, 4],[1, 5],[1, 6],[1, 8]]
  },
  4: {
    start: [3, 3],
    goal: [7, 0],
    obstacles: [[3, 2], [4, 2], [5, 2], [6, 2]]
  },
};

function setLevel(levelNumber) {
  currentLevel = levelNumber;
  const level = levels[levelNumber];
  robotX = level.start[0] * gridSize;
  robotY = level.start[1] * gridSize;
  finishX = level.goal[0] * gridSize;
  finishY = level.goal[1] * gridSize;
  commands = [];
  document.getElementById("commandList").textContent = "";
  document.getElementById("levelIndicator").textContent = `Level: ${currentLevel}`;
  document.getElementById("nextLevelBtn").disabled = true;
  drawGrid();
}

function drawGrid() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  for (let x = 0; x < 400; x += gridSize) {
    for (let y = 0; y < 400; y += gridSize) {
      ctx.strokeRect(x, y, gridSize, gridSize);
    }
  }

  // Obstacles
  const obs = levels[currentLevel].obstacles;
  //ctx.fillStyle = "gray";
  obs.forEach(([ox, oy]) => {
    ctx.drawImage(obstacleImg, ox * gridSize, oy * gridSize, gridSize, gridSize);
  });

  // Tujuan
  ctx.drawImage(brokenRobotImg, finishX, finishY, gridSize, gridSize);

  // Robot
  ctx.drawImage(robotImg, robotX, robotY, gridSize, gridSize);
}

function addCommand(cmd) {
  commands.push(cmd);
  document.getElementById("commandList").textContent = `Jumlah Perintah: ${commands.length}`;
}

function isObstacle(x, y) {
  return levels[currentLevel].obstacles.some(([ox, oy]) => ox * gridSize === x && oy * gridSize === y);
}

function runCommands() {
  let i = 0;
  const interval = setInterval(() => {
    if (i >= commands.length) {
      clearInterval(interval);
      checkFinish();
      return;
    }

    let cmd = commands[i];

    // Fitur logika if untuk Level 3 dan 4
    if ((currentLevel === 3 || currentLevel === 4) && cmd === "RIGHT") {
      const nextX = robotX + gridSize;
      const nextY = robotY;
      if (isObstacle(nextX, nextY)) {
        // Jika di kanan ada halangan → belok bawah
        cmd = "DOWN";
      }
    }

    // Jalankan perintah
    if (cmd === "RIGHT" && robotX < 360 && !isObstacle(robotX + gridSize, robotY)) {
        robotX += gridSize;
    } else if (cmd === "DOWN" && robotY < 360 && !isObstacle(robotX, robotY + gridSize)) {
        robotY += gridSize;
    } else if (cmd === "LEFT" && robotX > 0 && !isObstacle(robotX - gridSize, robotY)) {
        robotX -= gridSize;
    } else if (cmd === "UP" && robotY > 0 && !isObstacle(robotX, robotY - gridSize)) {
        robotY -= gridSize;
    }


    drawGrid();
    i++;
  }, 500);
}

function checkFinish() {
  if (robotX === finishX && robotY === finishY) {
    alert(`Selamat kamu sampai di sekolah! Selesai Level ${currentLevel}`);
    document.getElementById("nextLevelBtn").disabled = false;
    nextLevel();
  } else {
    alert("Kamu dimana?? Lagi Bolos Yah!");
  }
}

function resetGame() {
  const level = levels[currentLevel];
  robotX = level.start[0] * gridSize;
  robotY = level.start[1] * gridSize;
  commands = [];
  document.getElementById("commandList").textContent = "";
  drawGrid();
}

function nextLevel() {
  if (currentLevel < 4) {
    setLevel(currentLevel + 1);
  } else {
    alert("Semua level sudah selesai! 🎉");
  }
}
