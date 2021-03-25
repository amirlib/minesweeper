const HINT_TIMER_FREQ = 1000;

var gHintTimer;

function buildBoard(size) {
  var board = [];

  for (var i = 0; i < size; i++) {
    board.push([]);

    for (var j = 0; j < size; j++) {
      board[i].push(createCell());
    }
  }

  return board;
}

function createCell() {
  return {
    minesAroundCount: 0,
    isMarked: false,
    isMine: false,
    isShown: false,
  }
}

function placeMines(board, amount, startLocation) {
  var locations = createCellLocationsArr(board);

  // remove the first cell's location from the locations array
  locations.splice(
    locations.findIndex(function (location) {
      return location.i === startLocation.i && location.j === startLocation.j;
    }),
    1,
  );

  // get a random location from the locations array and set a mine on it
  for (var i = 0; i < amount; i++) {
    var idx = getRandomInt(0, locations.length);
    var mineLocation = board[locations[idx].i][locations[idx].j];

    mineLocation.isMine = true;

    locations.splice(idx, 1);
  }
}

function setMinesAroundCount(board) {
  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      if (board[i][j].isMine) continue;

      board[i][j].minesAroundCount = calcMinesAroundCell(board, { i, j });
    }
  }
}

function calcMinesAroundCell(board, location) {
  var count = 0

  for (var i = location.i - 1; i <= location.i + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = location.j - 1; j <= location.j + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;
      if (i === location.i && j === location.j) continue;

      if (board[i][j].isMine) count++;
    }
  }

  return count;
}

function renderBoard(board, isLose = false) {
  var strHTML = '';
  var elBoard = document.querySelector('.board-container tbody');

  for (var i = 0; i < board.length; i++) {
    strHTML += '<tr>\n';

    for (var j = 0; j < board[i].length; j++) {
      if (isLose && board[i][j].isMine) board[i][j].isShown = true;

      var cellClasses = geStringCellClasses(board[i][j]);
      var cellContent = getCellContentByCell(board[i][j]);

      strHTML += `\t<td><div id="cell-${i}-${j}" class="${cellClasses}" onClick="cellClicked(this, ${i}, ${j})" oncontextmenu="cellMarked(this, ${i}, ${j})">${cellContent}</div></td>\n`;
    }

    strHTML += '</tr>\n';
  }

  elBoard.innerHTML = strHTML;
}

function renderCell(elCell, i, j) {
  var classes = getArrCellClasses(gBoard[i][j]);

  elCell.innerText = getCellContentByCell(gBoard[i][j]);

  elCell.classList.remove('closed', 'mine', 'opened');
  elCell.classList.add(...classes);
}

function renderCellHintMode(board, location) {
  var cloned = cloneBoard(board);

  for (var i = location.i - 1; i <= location.i + 1; i++) {
    if (i < 0 || i >= board.length) continue;

    for (var j = location.j - 1; j <= location.j + 1; j++) {
      if (j < 0 || j >= board[0].length) continue;

      board[i][j].isShown = true;
    }
  }

  renderBoard(board);
  startHintTimer(cloned);
}

function geStringCellClasses(cell) {
  var cellClass = 'cell';

  if (cell.isMarked) return cellClass += ' closed';
  if (cell.isMine && cell.isShown) return cellClass += ' mine';
  if (cell.isShown) return cellClass += ' opened';

  return cellClass += ' closed';
}

function getArrCellClasses(cell) {
  var classes = [];

  if (cell.isMarked) classes.push('closed');
  else if (cell.isMine && cell.isShown) classes.push('mine');
  else if (cell.isShown) classes.push('opened');
  else classes.push('closed');

  return classes;
}

function getCellContentByCell(cell) {
  if (cell.isMarked) return FLAG;
  if (cell.isMine && cell.isShown) return MINE;
  if (cell.isShown && cell.minesAroundCount > 0) return cell.minesAroundCount;

  return EMPTY;
}

function startHintTimer(oldBoard) {
  if (gHintTimer) stopHintTimer();

  gHintTimer = setTimeout(stopHintRenderMode, HINT_TIMER_FREQ, oldBoard);
}

function stopHintTimer() {
  if (!gHintTimer) return;

  clearTimeout(gHintTimer);

  gHintTimer = null;
}

function stopHintRenderMode(board) {
  gBoard = board;
  gGame.isHint = false;
  gGame.isOn = true;

  renderBoard(gBoard);
}
