// Coding Tetris in JavaScript

// Global Variable
let canvas;
let ctx;
const W = 300, H = 600;
const BLOCK_W = W / COLS, BLOCK_H = H / ROWS;
let currentX, currentY;
const board = [];
let lose;
let interval;
let current;
let currentColor;
let currentShape;
const shapes = [
    [1, 1, 1, 1],
    [1, 1, 1, 0,
        1],
    [1, 1, 1, 0,
        0, 0, 1],
    [1, 1, 0, 0,
        1, 1],
    [1, 1, 0, 0,
        0, 1, 1],
    [0, 1, 1, 0,
        1, 1],
    [0, 1, 0, 0,
        1, 1, 1]
];
const colors = [
    'cyan', 'orange', 'blue', 'yellow', 'red', 'green', 'purple'
];

function init() {
    canvas = document.createElement("canvas");
    canvas.width = W;
    canvas.height = H;
    ctx = canvas.getContext("2d");
    document.body.appendChild(canvas);
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    lose = false;
    addEventListener();
    newShape();
    setInterval(tick, 250);
}

function newShape() {
    var id = Math.floor(Math.random() * shapes.length);
    var shape = shapes[id];
    current = [];
    for (var y = 0; y < 4; ++y) {
        current[y] = [];
        for (var x = 0; x < 4; ++x) {
            var i = 4 * y + x;
            if (typeof shape[i] != 'undefined' && shape[i]) {
                current[y][x] = id + 1;
            }
            else {
                current[y][x] = 0;
            }
        }
    }
    currentX = 5;
    currentY = 0;
}

function tick() {
    if (valid(0, 1)) {
        ++currentY;
    }
    else {
        freeze();
        clearLines();
        if (lose) {
            newGame();
            return false;
        }
        newShape();
    }
}
x
function freeze() {
    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            if (current[y][x]) {
                board[y + currentY][x + currentX] = currentColor;
            }
        }
    }
}

function clearLines() {
    for (var y = ROWS - 1; y >= 0; --y) {
        var rowFilled = true;
        for (var x = 0; x < COLS; ++x) {
            if (board[y][x] == 0) {
                rowFilled = false;
                break;
            }
        }
        if (rowFilled) {
            document.getElementById('clearsound').play();
            for (var yy = y; yy > 0; --yy) {
                for (var x = 0; x < COLS; ++x) {
                    board[yy][x] = board[yy - 1][x];
                }
            }
            ++y;
        }
    }
}

function newGame() {
    clearInterval(interval);
    init();
    newShape();
    lose = false;
    interval = setInterval(tick, 250);
}

function valid(x, y) {
    return x >= 0 && x < COLS && y >= 0 && y < ROWS;
}

function addEventListener() {
    document.addEventListener("keydown", keyDown, false);
    document.addEventListener("keyup", keyUp, false);
}

function keyDown(e) {
    switch (e.keyCode) {
        case 37:
            move(-1);
            break;
        case 38:
            rotate();
            break;
        case 39:
            move(1);
            break;
        case 40:
            tick();
            break;
    }
}

function keyUp(e) {
    switch (e.keyCode) {
        case 40:
            break;
    }
}

function move(dir) {
    if (valid(currentX + dir, currentY)) {
        currentX += dir;
    }
}

function rotate() {
    var rotated = rotateShape(current);
    if (valid(currentX, currentY)) {
        current = rotated;
    }
}

function rotateShape(shape) {
    var newShape = [];
    for (var y = 0; y < 4; ++y) {
        newShape[y] = [];
        for (var x = 0; x < 4; ++x) {
            newShape[y][x] = shape[x][3 - y];
        }
    }
    return newShape;
}

function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.strokeStyle = 'black';
    for (var x = 0; x < COLS; ++x) {
        for (var y = 0; y < ROWS; ++y) {
            drawBlock(x, y, board[y][x]);
        }
    }
    for (var y = 0; y < 4; ++y) {
        for (var x = 0; x < 4; ++x) {
            drawBlock(currentX + x, currentY + y, current[y][x]);
        }
    }
}

function drawBlock(x, y, color) {
    ctx.fillStyle = colors[color - 1];
    ctx.fillRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
    ctx.strokeRect(BLOCK_W * x, BLOCK_H * y, BLOCK_W - 1, BLOCK_H - 1);
}

init();

// End of Tetris Code
