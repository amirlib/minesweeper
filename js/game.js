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
var gLevel = getDefaultGameLevel();

function init() {
  gBoard = buildBoard(gLevel.SIZE);

  initManuallyButtons();
  initBestScores();
  renderMinesLeft();
  renderLives();
  renderHints();
  renderSafeClicks();
  renderBoard(gBoard);
}

function getDefaultGameValues() {
  return {
    isOn: false,
    markedCount: 0,
    mode: 'INITIAL', // INITIAL, PLAYING, GAME_OVER, HINT, SAFE_CLICK, MANUALLY_BOARD
    secsPassed: 0,
    shownCount: 0,
    usedHints: 0,
    usedLives: 0,
    usedSafeClicks: 0,
  };
}

function getDefaultGameLevel() {
  return {
    HINTS: 3,
    LIVES: 2,
    MINES: 2,
    SAFE_CLICKS: 3,
    SIZE: 4,
  };
}

function cellClicked(elCell, i, j) {
  switch (gGame.mode) {
    case 'INITIAL':
      startGame({ i, j });

      break;
    case 'HINT':
      if (!gGame.isOn) return; // if board is rendering in HINT mode

      gGame.isOn = false; // if user chooses to use hint

      renderCellHintMode(gBoard, { i, j });

      return;
    case 'GAME_OVER':
      return;
    case 'MANUALLY_BOARD':
      if (!gBoard[i][j].isShown && gGame.markedCount === gLevel.MINES) return;

      gBoard[i][j].isMine = !gBoard[i][j].isMine;
      gBoard[i][j].isShown = !gBoard[i][j].isShown;

      if (gBoard[i][j].isShown) {
        gGame.markedCount++;
      } else {
        gGame.markedCount--;
      }

      renderCell(gBoard, elCell, { i, j });
      renderMinesLeft();

      if (gGame.markedCount === gLevel.MINES) {
        activatePlayButton();
      } else {
        deactivatePlayButton();
      }

      return;
  }

  if (gBoard[i][j].isShown || gBoard[i][j].isMarked) return; // clicking on marked/opened cell

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
  gameOver();
  showLoseMsg();
  renderBoard(gBoard, true);
  renderSmiley(SMILEY_LOSE);
}

function winGame() {
  gameOver();
  showSuccessMsg();
  addScore(gGame.secsPassed, gLevel);
  renderSmiley(SMILEY_WIN);
}

function gameOver() {
  gGame.mode = 'GAME_OVER';
  gGame.isOn = false;

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
  startGameManually();
}

function startGameManually() {
  setMinesAroundCount(gBoard);
  startTimerInterval();
  resetManuallyButtons();

  gGame.mode = 'PLAYING';
  gGame.isOn = true;
}

function getLivesLeft() {
  return gLevel.LIVES - gGame.usedLives;
}

function getMinesLeft() {
  return gLevel.MINES - gGame.markedCount - gGame.usedLives;
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

  changeElAttr('#menu-level-2 #lives-container', 'innerText', lives);
}

function renderMinesLeft() {
  changeElAttr('#menu-level-1 #mines-left', 'innerText', getMinesLeft());
}

function renderSmiley(smiley) {
  changeElAttr('#menu-level-2 #smiley-button', 'innerText', smiley);
}

function changeDifficulty(elRadioBtn) {
  switch (elRadioBtn.value) {
    case 'easy':
      setLevel(3, 2, 2, 3, 4);

      break;
    case 'medium':
      setLevel(3, 3, 12, 3, 8);

      break;
    case 'hard':
      setLevel(3, 3, 30, 3, 12);

      break;
    default:
      setLevel(3, 2, 2, 3, 4);

      break;
  }

  reset();
}

function setLevel(hints, lives, mines, safeClicks, size) {
  gLevel.HINTS = hints;
  gLevel.LIVES = lives;
  gLevel.MINES = mines;
  gLevel.SAFE_CLICKS = safeClicks;
  gLevel.SIZE = size;
}

function resetPlayingMode() {
  gGame = getDefaultGameValues();

  closeModal();
  stopTimerInterval();
  renderSmiley();
  resetHints();
  resetSafeClicks();
  renderSmiley(SMILEY_NORMAL);
  init();
}

function reset() {
  switch (gGame.mode) {
    case 'MANUALLY_BOARD':
      resetManuallyMode();

      break;
    default:
      resetPlayingMode();

      break;
  }
}
