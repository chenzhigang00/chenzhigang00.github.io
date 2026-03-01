const DIRECTIONS = {
    up: { x: 0, y: -1 },
    down: { x: 0, y: 1 },
    left: { x: -1, y: 0 },
    right: { x: 1, y: 0 }
};

const BOARD = {
    columns: 16,
    rows: 16
};

const TICK_MS = 140;

const boardElement = document.getElementById("board");
const scoreElement = document.getElementById("score");
const statusElement = document.getElementById("status");
const pauseButton = document.getElementById("pause-button");
const restartButton = document.getElementById("restart-button");
const directionButtons = Array.from(document.querySelectorAll("[data-direction]"));

let state = createInitialState();
let queuedDirection = null;
let started = false;
let paused = false;
let lastTick = 0;

boardElement.style.gridTemplateColumns = `repeat(${BOARD.columns}, 1fr)`;
boardElement.style.gridTemplateRows = `repeat(${BOARD.rows}, 1fr)`;

function areOppositeDirections(current, next) {
    return current.x + next.x === 0 && current.y + next.y === 0;
}

function createInitialState() {
    const midX = Math.floor(BOARD.columns / 2);
    const midY = Math.floor(BOARD.rows / 2);
    const snake = [
        { x: midX, y: midY },
        { x: midX - 1, y: midY },
        { x: midX - 2, y: midY }
    ];

    return {
        snake,
        direction: DIRECTIONS.right,
        food: spawnFood(snake),
        score: 0,
        gameOver: false
    };
}

function toKey(point) {
    return `${point.x},${point.y}`;
}

function spawnFood(snake) {
    const occupied = new Set(snake.map(toKey));
    const available = [];

    for (let y = 0; y < BOARD.rows; y += 1) {
        for (let x = 0; x < BOARD.columns; x += 1) {
            const point = { x, y };
            if (!occupied.has(toKey(point))) {
                available.push(point);
            }
        }
    }

    if (available.length === 0) {
        return null;
    }

    return available[Math.floor(Math.random() * available.length)];
}

function withDirection(nextDirection) {
    if (!nextDirection || areOppositeDirections(state.direction, nextDirection)) {
        return;
    }

    state = {
        ...state,
        direction: nextDirection
    };
}

function advanceState() {
    if (state.gameOver) {
        return;
    }

    const nextHead = {
        x: state.snake[0].x + state.direction.x,
        y: state.snake[0].y + state.direction.y
    };

    const willEat = state.food &&
        nextHead.x === state.food.x &&
        nextHead.y === state.food.y;

    const collisionBody = willEat ? state.snake : state.snake.slice(0, -1);

    if (isOutOfBounds(nextHead) || collisionBody.some((segment) => segment.x === nextHead.x && segment.y === nextHead.y)) {
        state = {
            ...state,
            gameOver: true
        };
        return;
    }

    const snake = [nextHead, ...state.snake];
    if (!willEat) {
        snake.pop();
    }

    state = {
        ...state,
        snake,
        food: willEat ? spawnFood(snake) : state.food,
        score: willEat ? state.score + 1 : state.score
    };
}

function isOutOfBounds(point) {
    return point.x < 0 || point.y < 0 || point.x >= BOARD.columns || point.y >= BOARD.rows;
}

function resetGame() {
    state = createInitialState();
    queuedDirection = null;
    started = false;
    paused = false;
    lastTick = 0;
    render();
}

function togglePause() {
    if (!started || state.gameOver) {
        return;
    }

    paused = !paused;
    render();
}

function queueDirection(name) {
    const nextDirection = DIRECTIONS[name];
    if (!nextDirection || state.gameOver) {
        return;
    }

    if (!started) {
        started = true;
    }

    if (queuedDirection && areOppositeDirections(queuedDirection, nextDirection)) {
        return;
    }

    if (areOppositeDirections(state.direction, nextDirection)) {
        return;
    }

    queuedDirection = nextDirection;

    if (paused) {
        paused = false;
    }

    render();
}

function render() {
    const snakeCells = new Set(state.snake.map(toKey));
    const foodCell = state.food ? toKey(state.food) : null;

    boardElement.replaceChildren();

    for (let y = 0; y < BOARD.rows; y += 1) {
        for (let x = 0; x < BOARD.columns; x += 1) {
            const cell = document.createElement("div");
            const key = `${x},${y}`;
            cell.className = "cell";

            if (snakeCells.has(key)) {
                cell.classList.add("snake");
            } else if (foodCell === key) {
                cell.classList.add("food");
            }

            boardElement.appendChild(cell);
        }
    }

    scoreElement.textContent = String(state.score);
    pauseButton.textContent = paused ? "Resume" : "Pause";

    if (state.gameOver) {
        statusElement.textContent = "Game over. Press Restart to play again.";
    } else if (paused) {
        statusElement.textContent = "Paused.";
    } else if (!started) {
        statusElement.textContent = "Use arrow keys or WASD to start.";
    } else {
        statusElement.textContent = "Running.";
    }
}

function frame(timestamp) {
    if (lastTick === 0) {
        lastTick = timestamp;
    }

    if (started && !paused && !state.gameOver && timestamp - lastTick >= TICK_MS) {
        if (queuedDirection) {
            withDirection(queuedDirection);
            queuedDirection = null;
        }

        advanceState();
        lastTick = timestamp;
        render();
    }

    window.requestAnimationFrame(frame);
}

document.addEventListener("keydown", (event) => {
    const key = event.key.toLowerCase();
    const keyMap = {
        arrowup: "up",
        w: "up",
        arrowdown: "down",
        s: "down",
        arrowleft: "left",
        a: "left",
        arrowright: "right",
        d: "right"
    };

    if (key === " " || key === "p") {
        event.preventDefault();
        togglePause();
        return;
    }

    const direction = keyMap[key];
    if (direction) {
        event.preventDefault();
        queueDirection(direction);
    }
});

pauseButton.addEventListener("click", togglePause);
restartButton.addEventListener("click", resetGame);

for (const button of directionButtons) {
    button.addEventListener("click", () => {
        queueDirection(button.dataset.direction);
    });
}

render();
window.requestAnimationFrame(frame);
