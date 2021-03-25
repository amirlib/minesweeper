const HINT_TIMER_FREQ = 1000;

var gHintTimer;

function useHint() {
  if (!gGame.isOn || gGame.mode === 'HINT') return;

  gGame.usedHints++;
  gGame.mode = 'HINT';

  renderHints();
}

function getHintsLeft() {
  return gLevel.HINTS - gGame.usedHints;
}

function renderHints() {
  var hintsLeft = getHintsLeft();
  var hints = ` X ${hintsLeft}`;

  if (hintsLeft === 0) changeElAttr('#menu-level-2 #hint-button', 'disabled', true);

  changeElAttr('#menu-level-2 #hints-left', 'innerText', hints);
}

function resetHints() {
  stopHintTimer();
  changeElAttr('#menu-level-2 #hint-button', 'disabled', false); // enable the hint button
}

function startHintTimer(oldBoard) {
  if (gHintTimer) stopHintTimer();

  gHintTimer = setTimeout(stopHintRenderMode, HINT_TIMER_FREQ, oldBoard);
}

function stopHintRenderMode(board) {
  gBoard = board;
  gGame.mode = 'PLAYING';
  gGame.isOn = true;

  renderBoard(gBoard);
}

function stopHintTimer() {
  if (!gHintTimer) return;

  clearTimeout(gHintTimer);

  gHintTimer = null;
}
