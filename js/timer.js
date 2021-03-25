var TIMER_INTERVAL_FREQ = 1000;

var gElTimer = document.querySelector('#menu-level-1 .timer-container');

function startTimerInterval() {
  if (gTimerInterval) stopTimerInterval();

  resetTimer();

  gTimerInterval = setInterval(updateTimer, TIMER_INTERVAL_FREQ);
}

function stopTimerInterval() {
  if (!gTimerInterval) return;

  clearInterval(gTimerInterval);

  gTimerInterval = null;
}

function resetTimer() {
  gElTimer.innerText = '00:00';
  gGame.secsPassed = 0;
}

function updateTimer() {
  gGame.secsPassed++;
  gElTimer.innerText = secsToString(gGame.secsPassed);
}

function secsToString(seconds) {
  var secs = seconds % 60;
  var secsStr = secs < 10 ? `0${secs}` : `${secs}`;

  seconds = Math.floor(seconds / 60);

  var mins = seconds % 60;
  var minsStr = mins < 10 ? `0${mins}` : `${mins}`;

  return `${minsStr}:${secsStr}`;
}
