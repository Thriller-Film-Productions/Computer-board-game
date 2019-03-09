const w = 9;
const h = 31;
const gameState = [];
const moveButtons = [];
const bluePos = [(w - 1) / 2, 0];
const redPos = [(w - 1) / 2, h - 1];
const selected = [];
let thueMorse = [0];
let turn = 0;
let turnType = "move 1";

function setup() {
  for (let i = 0; i < w; i++) {
    let temp = [];
    for (let j = 0; j < h; j++) {
      temp.push(0);
    }
    gameState.push(temp);
  }
  for (let i = 0; i < w; i++) {
    let temp = [];
    for (let j = 0; j < h; j++) {
      temp.push(false);
    }
    selected.push(temp);
  }
  let buttonContainer = $("#moveButtons")
  for (let i = 0; i < 3; i++) {
    let temp = [];
    for (let j = 0; j < 3; j++) {
      let t = $(`<button onclick='move(${i-1}, ${j-1})'>`).css({
        width: "1vw",
        height: "1vw"
      });
      buttonContainer.append(t);
      temp.push(t);
    }
    buttonContainer.append("<br>");
    moveButtons.push(temp);
  }
  buttonContainer.css({
    bheight: "8vw",
    width: "7vw"
  })
  console.log(gameState);
  draw();
}

function draw() {
  console.log(getThue(turn), thueMorse)
  $("#game").empty();
  $("#moveButtons").css({
    position: "fixed",
    left: "35vw",
    top: "40vh"
  });
  let c;
  if (turnType == "move 1") {
    c = "#004b74";
  } else if (turnType == "edit 1") {
    c = "#385c70"
  } else if (turnType == "move 2") {
    c = "#6a1d00"
  } else {
    c = "#704333"
  }
  gameState[bluePos[0]][bluePos[1]] = 1;
  gameState[redPos[0]][redPos[1]] = 2;
  $("#moveButtons").css({
    backgroundColor: c
  });
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      let temp = $(`<img src='Icon Nothing.svg' onclick="select(${i}, ${j})">`);
      if (gameState[i][j] === 1) {
        temp = $(`<img src='Icon P1.svg'>`)
      }
      if (gameState[i][j] === 2) {
        temp = $(`<img src='Icon P2.svg'>`)
      }
      if (gameState[i][j] === 3) {
        temp = $(`<img src='Icon P1 Coin.svg' onclick="select(${i}, ${j})">`)
      }
      if (gameState[i][j] === 4) {
        temp = $(`<img src='Icon P2 Coin.svg' onclick="select(${i}, ${j})">`)
      }
      $("#game").append(temp);
      if (selected[i][j]) {
        let thingy = $(`<img src='Selected.svg' onclick="select(${i}, ${j})">`)
        $("#game").append(thingy);
        thingy.width(32);
        thingy.height(32);
        thingy.css({
          position: "absolute",
          left: `${i*32}px`,
          top: `${j*32}px`
        })
      }
      $("#game").css({
        height: `${h*32}px`
      });
      temp.width(32);
      temp.height(32);
      temp.css({
        position: "absolute",
        left: `${i*32}px`,
        top: `${j*32}px`
      })
    }
  }
  if (bluePos[1] == h - 1) {
    let win = $("<h1>Blue wins!</h1>");
    win.css({
      fontFamily: "Ubuntu, sans-serif"
    })
    $("body").empty().append(win);
  } else if (redPos[1] == 0) {
    let win = $("<h1>Red wins!</h1>");
    win.css({
      fontFamily: "Ubuntu, sans-serif"
    })
    $("body").empty().append(win);
  }
}

function move(y, x) {
  if (turnType == "move 1" || turnType == "move 2") {
    if (turnType == "move 2" && redPos[0] + x >= 0) {
      if (gameState[redPos[0] + x][redPos[1] + y] == 0 && (JSON.stringify(gameState[redPos[0]][redPos[1] + y]).match(/^(0|2)$/) && JSON.stringify(gameState[redPos[0] + x][redPos[1]]).match(/^(0|2)$/))) {
        redPos[0] += x;
        redPos[1] += y;
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < h; j++) {
            if (gameState[i][j] == 2) {
              console.log("MATCH", i, j, redPos[0], redPos[1]);
              gameState[i][j] = 4;
              gameState[redPos[0]][redPos[1]] = 2;
            }
          }
        }
      }
    } else {
      if (gameState[bluePos[0] + x][bluePos[1] + y] == 0 && JSON.stringify(gameState[bluePos[0]][bluePos[1] + y]).match(/^(0|1)$/) && JSON.stringify(gameState[bluePos[0] + x][bluePos[1]]).match(/^(0|1)$/)) {
        bluePos[0] += x;
        bluePos[1] += y;
        for (let i = 0; i < w; i++) {
          for (let j = 0; j < h; j++) {
            if (gameState[i][j] == 1) {
              console.log("MATCH", i, j, bluePos[0], bluePos[1]);
              gameState[i][j] = 3;
              gameState[bluePos[0]][bluePos[1]] = 1;
            }
          }
        }
      }
    }
    if (getThue(turn) == 0) {
      if (turnType == "move 1") {
        turnType = "move 2";
      } else {
        turnType = "edit 1";
      }
    } else {
      if (turnType == "move 2") {
        turnType = "move 1";
      } else {
        turnType = "edit 2";
      }
    }
  } else {
    doSelectionRules()
  }
  draw()
}

function select(x, y) {
  if (turnType == "edit 1" || turnType == "edit 2") {
    if (selected[x][y] == false) {
      selected[x][y] = true;
    } else {
      selected[x][y] = false;
    }
    draw()
  }
}

function doSelectionRules() {
  const types = {
    empty: 0,
    redCoin: 0,
    blueCoin: 0
  }
  const positions = [];
  for (let i = 0; i < w; i++) {
    for (let j = 0; j < h; j++) {
      if (selected[i][j] == true) {
        let num = gameState[i][j];
        selected[i][j] = false;
        positions.push([i, j, num]);
        if (num == 0) {
          types.empty++;
        } else if (num == 3) {
          types.blueCoin++;
        } else if (num == 4) {
          types.redCoin++;
        }
      }
    }
  }
  console.log(types, positions)
  if (turnType == "edit 1") {
    if (types.empty == 1 && types.blueCoin == 2) {
      for (let square of positions) {
        console.log(square);
        if (square[2] == 0) {
          gameState[square[0]][square[1]] = 3;
        } else {
          gameState[square[0]][square[1]] = 0;
        }
      }
    }

    if (types.blueCoin == 2 && types.redCoin == 1) {
      for (let square of positions) {
        gameState[square[0]][square[1]] = 0;
      }
    }
  } else {
    if (types.empty == 1 && types.redCoin == 2) {
      for (let square of positions) {
        console.log(square);
        if (square[2] == 0) {
          gameState[square[0]][square[1]] = 4;
        } else {
          gameState[square[0]][square[1]] = 0;
        }
      }
    }

    if (types.redCoin == 2 && types.blueCoin == 1) {
      for (let square of positions) {
        gameState[square[0]][square[1]] = 0;
      }
    }
  }
  if (getThue(turn) == 0) {
    if (turnType == "edit 1") {
      turnType = "edit 2";
    } else {
      turnType = `move ${getThue(turn+1)+1}`;
      turn++;
    }
  } else {
    if (turnType == "edit 2") {
      turnType = "edit 1";
    } else {
      turnType = `move ${getThue(turn+1)+1}`;
      turn++
    }
  }
}

function getThue(n) {
  while (thueMorse[n] == undefined) {
    let newSeq = [];
    for (let i = 0; i < thueMorse.length; i++) {
      if (thueMorse[i] == 0) {
        newSeq.push(0);
        newSeq.push(1);
      } else {
        newSeq.push(1);
        newSeq.push(0);
      }
    }
    thueMorse = newSeq;
  }
  return thueMorse[n];
}

window.onload = setup;
