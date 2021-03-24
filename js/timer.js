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

  var time = gGame.secsPassed;
  var secs = time % 60;
  var secsStr = secs < 10 ? `0${secs}` : `${secs}`;
  time = Math.floor(time / 60);
  var mins = time % 60;
  var minsStr = mins < 10 ? `0${mins}` : `${mins}`;

  gElTimer.innerText = `${minsStr}:${secsStr}`;
}
