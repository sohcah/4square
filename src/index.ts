import * as PIXI from "pixi.js";
import winners from "./winners";

function sleep(time: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve(true), time);
  });
}

// Create PIXI Renderer
const app = new PIXI.Application({
  resizeTo: window,
  backgroundColor: 0x000000,
  antialias: true,
});
document.body.appendChild(app.view);

var moveTextEl = document.createElement("div");
document.body.appendChild(moveTextEl);
moveTextEl.id = "moveText";
moveTextEl.style.position = "fixed";
moveTextEl.style.top = "8px";
moveTextEl.style.right = "8px";
moveTextEl.style.color = "white";
moveTextEl.style.fontSize = "24px";

// Window Resize Handler
function handleResizeEvent() {
  min =
    (window.innerWidth - 16) / 7 < (window.innerHeight - 16) / 6
      ? "width"
      : "height";
  circleSize = Math.min(
    (window.innerWidth - 16) / 7,
    (window.innerHeight - 16) / 6
  );
  x_offset = (window.innerWidth - 7 * circleSize) / 2;
  y_offset = (window.innerHeight - 6 * circleSize) / 2;
}
window.addEventListener("resize", handleResizeEvent);

// Setup Grid
var grid: number[][] = [];
for (let x = 0; x < 7; x++) {
  let col = [];
  for (var y = 0; y < 6; y++) {
    col.push(0);
  }
  grid.push(col);
}

var colors: number[] = [0x000000, 0xffff00, 0xff0000, 0x00ff00];

// Setup Circles
var backdropCircles = new PIXI.Graphics();
app.stage.addChild(backdropCircles);
var backdropBoard = new PIXI.Graphics();
app.stage.addChild(backdropBoard);

// Circle Size
var min =
  (window.innerWidth - 16) / 7 < (window.innerHeight - 16) / 6
    ? "width"
    : "height";
var circleSize = Math.min(
  (window.innerWidth - 16) / 7,
  (window.innerHeight - 16) / 6
);
var x_offset = (window.innerWidth - 7 * circleSize) / 2;
var y_offset = (window.innerHeight - 6 * circleSize) / 2;

function checkGrid(grid: number[][]) {
  var x = (i: number) => grid[w[i][0]][w[i][1]];
  for (var w of winners) {
    if (x(0) > 0 && x(0) < 3 && x(0) == x(1) && x(1) == x(2) && x(2) == x(3)) {
      return w;
    }
  }
  return false;
}

var level = 5000;

function shuffle(a: any[]) {
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
var xArray = [0, 1, 2, 3, 4, 5, 6];
var moved = false;
var win: number[][] = [];
var circles: number[][] = [];
var latestMove: number[] = [];

async function runRow(row: number) {
  if (checkGrid(grid)) {
    return alert(
      "This game is already over. Refresh the page to start a new game."
    );
  }
  if (grid[row].indexOf(0) !== -1) {
    if (moved == false) {
      grid = [];
      for (let x = 0; x < 7; x++) {
        let col = [];
        for (var y = 0; y < 6; y++) {
          col.push(0);
        }
        grid.push(col);
      }
      circles = [];
    }
    moved = true;
    circles.push([row, grid[row].indexOf(0), time]);
    grid[row][grid[row].indexOf(0)] = 1;
    var youWon = checkGrid(grid);
    if (youWon) {
      win = youWon;
      return setTimeout(() => alert("YOU WON!"), 700);
    }

    await sleep(500);

    // Play Move
    var block = [];
    var move = null;
    var moveText = "RANDOM";
    shuffle(xArray);
    if (level >= 2) {
      for (var x of xArray) {
        if (grid[x].indexOf(0) === -1) continue;
        let index = grid[x].indexOf(0);
        grid[x][index] = 2;
        if (checkGrid(grid)) {
          moveText = "WIN";
          move = x;
          grid[x][index] = 0;
          break;
        }
        grid[x][index] = 0;
      }
    }
    if (level >= 3 && move === null) {
      for (var x of xArray) {
        if (grid[x].indexOf(0) === -1) continue;
        let index = grid[x].indexOf(0);
        grid[x][index] = 1;
        if (checkGrid(grid)) {
          moveText = "BLOCK_WIN";
          move = x;
          grid[x][index] = 0;
          break;
        }
        grid[x][index] = 0;
      }
    }
    if (level >= 4 && move === null) {
      for (var x of xArray) {
        if (grid[x].indexOf(0) === -1) continue;
        let index = grid[x].indexOf(0);
        grid[x][index + 1] = 1;
        if (checkGrid(grid)) {
          moveText = "NO_GIFT";
          block.push(x);
        }
        grid[x][index + 1] = 0;
      }
    }
    if (level >= 5 && move === null) {
      for (var x of xArray) {
        if (grid[x].indexOf(0) === -1 || block.includes(x)) continue;
        let index = grid[x].indexOf(0);
        grid[x][index] = 1;
        var winCount = 0;
        for (var x2 of xArray) {
          var index2 = grid[x2].indexOf(0);
          grid[x2][index2] = 1;
          if (checkGrid(grid)) {
            winCount++;
          }
          grid[x2][index2] = 0;
        }
        if (winCount >= 2) {
          moveText = "BLOCK_FORK";
          move = x;
          grid[x][index] = 0;
          break;
        }
        grid[x][index] = 0;
      }
    }
    console.log("MOVE", move);
    if (move === null) {
      for (var x of xArray) {
        if (grid[x].indexOf(0) !== -1 && !block.includes(x)) {
          move = x;
          break;
        }
      }
    }
    if (move === null) {
      move = xArray.find((x) => grid[x].indexOf(0) !== -1);
    }
    if (move !== null && move !== undefined) {
      circles.push([move, grid[move].indexOf(0), time]);
      latestMove = [move, grid[move].indexOf(0)];
      grid[move][grid[move].indexOf(0)] = 2;
    }
    var el = document.getElementById("moveText");
    if (el) {
      el.innerText = moveText;
    }
    var comWon = checkGrid(grid);
    if (comWon) {
      win = comWon;
      console.log(comWon);
      setTimeout(() => alert("THE COMPUTER WON!"), 700);
    }
  }
}

document.addEventListener("click", (ev) => {
  if (ev.button === 0) {
    var row = Math.floor((ev.clientX - x_offset) / circleSize);
    runRow(row);
  }
});

document.addEventListener("touchend", (ev) => {
  var row = Math.floor((ev.changedTouches[0].clientX - x_offset) / circleSize);
  runRow(row);
});

document.addEventListener("keypress", (ev) => {
  if (["1", "2", "3", "4", "5", "6", "7"].includes(ev.key)) {
    var row = Number(ev.key) - 1;
    runRow(row);
  }
});

var ticker = 0;
var time = 0;

app.ticker.add((delta: number) => {
  ticker += delta;
  time += delta;
  if (ticker > 50 && !moved) {
    var tick = Math.floor(Math.random() * 140);
    circles = [];
    for (var i = 0; i < 4; i++) {
      let x = winners[tick][i];
      circles.push([x[0], x[1], time, 3, 8]);
    }
    console.log(circles);
    ticker = ticker % 50;
  }
  backdropCircles.clear();
  backdropBoard.clear();
  backdropBoard.lineStyle(0);
  backdropBoard.beginFill(0x2222ff);
  backdropBoard.drawRoundedRect(
    x_offset,
    y_offset,
    circleSize * 7,
    circleSize * 6,
    circleSize * 0.1
  );
  backdropCircles.endFill();
  for (let x = 0; x < 7; x++) {
    for (let y = 0; y < 6; y++) {
      backdropBoard.beginHole();
      backdropBoard.drawCircle(
        circleSize * (x + 0.5) + x_offset,
        circleSize * (y + 0.5) + y_offset,
        circleSize / 2.5
      );
      backdropBoard.endHole();
    }
  }
  for (var circle of circles) {
    backdropCircles.lineStyle(
      circleSize /
        (win
          .map((i) => i.slice(0, 2).join(","))
          .includes([circle[0], circle[1]].join(","))
          ? 10
          : latestMove.join(",") === [circle[0], circle[1]].join(",")
          ? 20
          : 0),
      win
        .map((i) => i.slice(0, 2).join(","))
        .includes([circle[0], circle[1]].join(","))
        ? 0x00ff00
        : latestMove.join(",") === [circle[0], circle[1]].join(",")
        ? 0xffffff
        : 0x000000
    );
    backdropCircles.beginFill(
      colors[circle[3] || grid[circle[0]][circle[1]]] ?? 0x00ff00,
      1
    );
    backdropCircles.drawCircle(
      circleSize * (circle[0] + 0.5) + x_offset,
      (circleSize * (5 - circle[1] + 0.5) + y_offset) *
        Math.min(
          1,
          (((time - 7 - circle[2]) / (circle[4] || 30)) * 6) / (6 - circle[1])
        ),
      circleSize / 2.5
    );
    backdropCircles.endFill();
  }
});
