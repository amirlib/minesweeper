const EMPTY = ' ';
const FLAG = '🚩';
const LIVE = '❤️';
const MINE = '💣';
const MODE_LOSE = '💀';
const MODE_NORMAL = '😐';
const MODE_WIN = '😎';
const USED_LIVE = '🖤';
const HINT_TIMER_FREQ = 1000;

var gBoard;
var gHintTimer;
var gGame = getDefaultGameValues();
var gLevel = {
  HINTS: 3,
  LIVES: 2,
  MINES: 2,
  SIZE: 4,
};
var gTimerInterval;

function init() {
  gBoard = buildBoard(gLevel.SIZE);

  renderMinesLeft();
  renderLives();
  renderHints();
  renderBoard(gBoard);
}

function getDefaultGameValues() {
  return {
    isHint: false,
    isOn: false,
    markedCount: 0,
    mode: MODE_NORMAL,
    secsPassed: 0,
    shownCount: 0,
    usedHints: 0,
    usedLives: 0,
  };
}

function cellClicked(elCell, i, j) {
  if (!gGame.isOn) startGame({ i, j });
  if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return;

  if (gGame.isHint) {
    renderCellHintMode(gBoard, { i, j });

    return;
  }

  gBoard[i][j].isShown = true;
  gGame.shownCount++;

  renderCell(elCell, i, j);

  if (gBoard[i][j].isMine) {
    gGame.usedLives++;

    renderLives();
  }

  checkGameOver();
}

function cellMarked(elCell, i, j) {
  event.preventDefault();

  if (event.which !== 3) return; // if not a right click
  if (!gGame.isOn || gBoard[i][j].isShown) return; // if game is off or the cell is already open
  if (!gBoard[i][j].isMarked && gGame.markedCount === gLevel.MINES) return; // if there are no flags left

  gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
  gGame.markedCount += gBoard[i][j].isMarked ? 1 : -1;

  renderMinesLeft();
  renderCell(elCell, i, j);
  checkGameOver();
}

function checkGameOver() {
  if (gGame.usedLives === gLevel.LIVES) loseGame();
  else if (gGame.markedCount + gGame.shownCount === gLevel.SIZE ** 2) winGame();
}

function useHint() {
  if (!gGame.isOn || gGame.isHint) return;

  gGame.usedHints++;
  gGame.isHint = true;

  renderHints();
}

function loseGame() {
  gGame.mode = MODE_LOSE;

  gameOver();
  showLoseMsg();
}

function winGame() {
  gGame.mode = MODE_WIN;

  gameOver();
  showSuccessMsg();
}

function gameOver() {
  gGame.isOn = false;

  renderMode();
  stopTimerInterval();
}

function showLoseMsg() {
  showModal('Unfortunately you lost :(');
}

function showSuccessMsg() {
  showModal('Congratulations you won the game :)');
}

function startGame(startLocation) {
  placeMines(gBoard, gLevel.MINES, startLocation);
  setMinesAroundCount(gBoard);
  startTimerInterval();

  gGame.isOn = true;
}

function renderHints() {
  var gElHints = document.querySelector('#menu-level-2 #hints-left');
  var hintsLeft = gLevel.HINTS - gGame.usedHints;
  var hints = ` X ${hintsLeft}`;

  if (hintsLeft === 0) {
    var gElHintButton = document.querySelector('#menu-level-2 #hint-button');

    gElHintButton.disabled = true;
  }

  gElHints.innerText = hints;
}

function renderMinesLeft() {
  var gElMinesLeft = document.querySelector('#menu-level-1 #mines-left');

  gElMinesLeft.innerText = gLevel.MINES - gGame.markedCount;
}

function renderMode() {
  var gElModeButton = document.querySelector('#menu-level-2 #mode-button');

  gElModeButton.innerText = gGame.mode;
}

function renderLives() {
  var gElLives = document.querySelector('#menu-level-2 .lives-container');
  var livesLeft = gLevel.LIVES - gGame.usedLives;
  var lives = '';

  for (var i = 0; i < livesLeft; i++) {
    lives += LIVE;
  }

  for (var i = livesLeft; i < gLevel.LIVES; i++) {
    lives += USED_LIVE;
  }

  gElLives.innerText = lives;
}

function changeDifficulty(elRadioBtn) {
  switch (elRadioBtn.value) {
    case 'small':
      setLevel(3, 2, 2, 4);

      break;
    case 'medium':
      setLevel(3, 3, 12, 8);

      break;
    case 'large':
      setLevel(3, 3, 30, 12);

      break;
    default:
      setLevel(3, 2, 2, 4);

      break;
  }

  reset();
}

function setLevel(hints, lives, mines, size) {
  gLevel.HINTS = hints;
  gLevel.LIVES = lives;
  gLevel.MINES = mines;
  gLevel.SIZE = size;
}

function reset() {
  gGame = getDefaultGameValues();

  closeModal();
  stopTimerInterval();
  renderMode();
  init();
}
