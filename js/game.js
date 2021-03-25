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
    isOn: false,
    markedCount: 0,
    mode: 'INITIAL', // INITIAL, PLAYING, GAME_OVER, HINT
    secsPassed: 0,
    shownCount: 0,
    smiley: SMILEY_NORMAL,
    usedHints: 0,
    usedLives: 0,
  };
}

function cellClicked(elCell, i, j) {
  if (gGame.mode === 'INITIAL') startGame({ i, j }); // first ever click
  if (gGame.mode === 'GAME_OVER') return; // if the game in game over mode
  if (!gGame.isOn && gGame.mode === 'HINT') return; // if board is rendering in HINT mode
  if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return; // clicking on marked/opened cell

  // if user choose to use hint
  if (gGame.mode === 'HINT') {
    gGame.isOn = false;

    renderCellHintMode(gBoard, { i, j });

    return;
  }

  // show and render the desired cell
  gBoard[i][j].isShown = true;
  gGame.shownCount++;

  expandShown(gGame, gBoard, elCell, { i, j });

  // if the desired cell is a mine
  if (gBoard[i][j].isMine) {
    gGame.usedLives++;

    renderLives();

    if (getMinesLeft() === -1) {
      // used all flags but hit a mine
      gGame.usedLives = gLevel.LIVES;
    } else {
      renderMinesLeft();
    }
  }

  checkGameOver();
}

function cellMarked(elCell, i, j) {
  event.preventDefault();

  if (event.which !== 3) return; // if not a right click
  if (!gGame.isOn || gBoard[i][j].isShown) return; // if game is off or the cell is already open
  if (!gBoard[i][j].isMarked && getMinesLeft() === 0) return; // if there are no flags left

  gBoard[i][j].isMarked = !gBoard[i][j].isMarked;
  gGame.markedCount += gBoard[i][j].isMarked ? 1 : -1;

  renderMinesLeft();
  renderCell(gBoard, elCell, { i, j });
  checkGameOver();
}

function checkGameOver() {
  if (gGame.usedLives === gLevel.LIVES) loseGame();
  else if (gGame.markedCount + gGame.shownCount === gLevel.SIZE ** 2) winGame();
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
  gGame.mode = 'GAME_OVER';
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

  gGame.mode = 'PLAYING';
  gGame.isOn = true;
}

function getLivesLeft() {
  return gLevel.LIVES - gGame.usedLives;
}

function getMinesLeft() {
  return gLevel.MINES - gGame.markedCount - gGame.usedLives;
}

function renderMinesLeft() {
  changeElAttr('#menu-level-1 #mines-left', 'innerText', getMinesLeft());
}

function renderSmiley() {
  changeElAttr('#menu-level-2 #smiley-button', 'innerText', gGame.smiley);
}

function renderLives() {
  var livesLeft = getLivesLeft();
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
  stopTimerInterval();
  renderSmiley();
  resetHints();
  init();
}
