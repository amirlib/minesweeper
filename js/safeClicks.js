const SAFE_CLICK_TIMER_FREQ = 2000;

var gSafeClickTimer;

function useSafeClick() {
  if (!gGame.isOn || gGame.mode === 'SAFE_CLICK') return;

  gGame.usedSafeClicks++;
  gGame.mode = 'SAFE_CLICK';

  renderSafeClicks();
  renderCellSafeClickMode(gBoard);
}

function getSafeClicksLeft() {
  return gLevel.SAFE_CLICKS - gGame.usedSafeClicks;
}

function renderSafeClicks() {
  var safeClicksLeft = getSafeClicksLeft();
  var safeClicks = ` X ${safeClicksLeft}`;

  if (safeClicksLeft === 0) changeElAttr('#menu-level-3 #safe-click-button', 'disabled', true);

  changeElAttr('#menu-level-3 #safe-clicks-left', 'innerText', safeClicks);
}

function resetSafeClicks() {
  stopSafeClickTimer();
  changeElAttr('#menu-level-3 #safe-clicks-left', 'disabled', false); // enable the hint button
}

function startSafeClickTimer(location) {
  if (gHintTimer) stopSafeClickTimer();

  gHintTimer = setTimeout(stopSafeClickRenderMode, SAFE_CLICK_TIMER_FREQ, location);
}

function stopSafeClickRenderMode(location) {
  gGame.mode = 'PLAYING';

  cellEl.classList.remove('safe-click');
}

function stopSafeClickTimer() {
  if (!gSafeClickTimer) return;

  clearTimeout(gSafeClickTimer);

  gSafeClickTimer = null;
}
