const EMPTY = ' ';
const FLAG = '🚩';
const LIVE = '❤️';
const MINE = '💣';
const SMILEY_LOSE = '💀';
const SMILEY_NORMAL = '😐';
const SMILEY_WIN = '😎';
const USED_LIVE = '🖤';

var gBoard;
var gTimerInterval;
var gGame = getDefaultGameValues();
var gLevel = {
  HINTS: 3,
  LIVES: 2,
  MINES: 2,
  SIZE: 4,
};

function init() {
  gBoard = buildBoard(gLevel.SIZE);

  initBestScores();
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
    secsPassed: 0,
    shownCount: 0,
    smiley: SMILEY_NORMAL,
    usedHints: 0,
    usedLives: 0,
  };
}

function cellClicked(elCell, i, j) {
  if (!gGame.isOn && !gGame.isHint) startGame({ i, j }); // first ever click
  if (!gGame.isOn && gGame.isHint) return; // if board is rendering in HINT mode
  if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return; // clicking on marked/opened cell

  // if user choose to use hint
  if (gGame.isHint) {
    gGame.isOn = false;

    renderCellHintMode(gBoard, { i, j });

    return;
  }

  // show and render the desired cell
  gBoard[i][j].isShown = true;
  gGame.shownCount++;

  renderCell(elCell, i, j);

  // if the desired cell is a mine
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
  gGame.smiley = SMILEY_LOSE;

  gameOver();
  showLoseMsg();
  renderBoard(gBoard, true);
}

function winGame() {
  gGame.smiley = SMILEY_WIN;

  gameOver();
  showSuccessMsg();
  addScore(gGame.secsPassed, gLevel);
}

function gameOver() {
  gGame.isOn = false;

  renderSmiley();
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
  var hintsLeft = gLevel.HINTS - gGame.usedHints;
  var hints = ` X ${hintsLeft}`;

  if (hintsLeft === 0) changeElAttr('#menu-level-2 #hint-button', 'disabled', true);

  changeElAttr('#menu-level-2 #hints-left', 'innerText', hints);
}

function renderMinesLeft() {
  changeElAttr('#menu-level-1 #mines-left', 'innerText', gLevel.MINES - gGame.markedCount);
}

function renderSmiley() {
  changeElAttr('#menu-level-2 #smiley-button', 'innerText', gGame.smiley);
}

function renderLives() {
  var livesLeft = gLevel.LIVES - gGame.usedLives;
  var lives = '';

  for (var i = 0; i < livesLeft; i++) {
    lives += LIVE;
  }

  for (var i = livesLeft; i < gLevel.LIVES; i++) {
    lives += USED_LIVE;
  }

  changeElAttr('#menu-level-2 .lives-container', 'innerText', lives);
}

function changeDifficulty(elRadioBtn) {
  switch (elRadioBtn.value) {
    case 'easy':
      setLevel(3, 2, 2, 4);

      break;
    case 'medium':
      setLevel(3, 3, 12, 8);

      break;
    case 'hard':
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
  stopHintTimer();
  stopTimerInterval();
  renderSmiley();
  init();
}
