const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

// create the unit
const is_mobile =
  !!navigator.userAgent.match(/iphone|android|blackberry/gi) || false;

function useResize(element) {
  const resize = () => {
    if (window.innerHeight < window.innerWidth) {
      element.height = window.innerHeight;
      element.width = window.innerHeight;
    } else {
      element.height = window.innerWidth;
      element.width = window.innerWidth;
    }
  };
  window.addEventListener("resize", () => resize(element), false);
  return { resize };
}

const { resize: resizeCanvas } = useResize(canvas);
resizeCanvas();

let boxSize;
is_mobile ? (boxSize = canvas.width / 20) : (boxSize = canvas.width / 30);
let cols = canvas.width / boxSize;
let rows = canvas.height / boxSize;
// load imagess

const foodImg = new Image(boxSize, boxSize);
foodImg.src = "./img/food.svg";

// load audio files

let deadAudio = new Audio("./audio/dead.mp3");
let eatAudio = new Audio("./audio/eat.mp3");
let moveUpAudio = new Audio("./audio/up.mp3");
let moveDownAudio = new Audio("./audio/down.mp3");
let moveLeftAudio = new Audio("./audio/left.mp3");
let moveRightAudio = new Audio("./audio/right.mp3");

// create the snake

let snake = [
  {
    x: rows / 2,
    y: cols / 2,
  },
];

// create the food

let food = {
  x: Math.floor(Math.random() * rows),
  y: Math.floor(Math.random() * cols),
};

// create the score var

let score = 1;

//control the snake

let d;

document.addEventListener("keydown", (e) => direction(e.keyCode));
document.addEventListener("swiped-left", () => direction(37));
document.addEventListener("swiped-up", () => direction(38));
document.addEventListener("swiped-right", () => direction(39));
document.addEventListener("swiped-down", () => direction(40));

function direction(key) {
  if (key == 37 && d != "RIGHT") {
    moveLeftAudio.play();
    d = "LEFT";
  } else if (key == 38 && d != "DOWN") {
    d = "UP";
    moveUpAudio.play();
  } else if (key == 39 && d != "LEFT") {
    d = "RIGHT";
    moveRightAudio.play();
  } else if (key == 40 && d != "UP") {
    d = "DOWN";
    moveDownAudio.play();
  }
}

// cheack collision function
function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x == array[i].x && head.y == array[i].y) {
      return true;
    }
  }
  return false;
}

function drawSquare(x, y, w, h, color) {
  ctx.fillStyle = color;
  ctx.fillRect(x, y, w, h);
}
function drawStrokeSquare(x, y, w, h, color) {
  ctx.strokeStyle = color;
  ctx.strokeRect(x, y, w, h);
}

function drawBoard() {
  for (let y = 0; y < cols; y++) {
    for (let x = 0; x < rows; x++) {
      let boxColor =
        (y + x) % 2 === 1 ? "rgba(162,209,73, 1)" : "rgba(170,215,81,1)";
      drawSquare(x * boxSize, y * boxSize, boxSize + 2, boxSize + 2, boxColor);
    }
  }
}
// draw everything to the canvas

function draw() {
  drawBoard();

  for (let i = 0; i < snake.length; i++) {
    let snakeColor = i == 0 ? "green" : "white";
    drawSquare(
      snake[i].x * boxSize,
      snake[i].y * boxSize,
      boxSize,
      boxSize,
      snakeColor
    );
    drawStrokeSquare(
      snake[i].x * boxSize,
      snake[i].y * boxSize,
      boxSize,
      boxSize,
      "green"
    );
  }

  ctx.drawImage(foodImg, food.x * boxSize, food.y * boxSize, boxSize, boxSize);

  // old head position
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  // which direction
  if (d == "LEFT") snakeX -= 1;
  if (d == "UP") snakeY -= 1;
  if (d == "RIGHT") snakeX += 1;
  if (d == "DOWN") snakeY += 1;

  // if the snake eats the food
  if (snakeX == food.x && snakeY == food.y) {
    score++;
    document.getElementById("score").innerHTML = `score: ${score}`;
    eatAudio.play();
    food = {
      x: Math.floor(Math.random() * rows),
      y: Math.floor(Math.random() * cols),
    };
    // we don't remove the tail
  } else {
    // remove the tail
    snake.pop();
  }

  // add new Head

  let newHead = {
    x: snakeX,
    y: snakeY,
  };

  // game over

  if (
    snakeX < 0 ||
    snakeX > rows - 1 ||
    snakeY < 0 ||
    snakeY > cols - 1 ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    setTimeout(() => {
      alert(`Your score is ${score}!!`);
    }, 0);
    deadAudio.play();
  }

  snake.unshift(newHead);
}

// call draw function every 100 ms

let game = setInterval(draw, 100);
