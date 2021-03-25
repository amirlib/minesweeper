const EASY_SCORES_KEY = 'easyScores';
const MEDIUM_SCORES_KEY = 'mediumScores';
const HARD_SCORES_KEY = 'hardScores';

function initBestScores() {
  if (typeof (Storage) === 'undefined') {
    changeElAttr('.best-scores-container', 'innerHTML', '');

    return;
  }

  renderEasyScores();
  renderMediumScores();
  renderHardScores();
}

function renderEasyScores() {
  renderScores(EASY_SCORES_KEY);
}

function renderMediumScores() {
  renderScores(MEDIUM_SCORES_KEY);
}

function renderHardScores() {
  renderScores(HARD_SCORES_KEY);
}

function renderScores(key) {
  var scores = localStorage.getItem(key);
  var helperName

  if (!scores) {
    displayNoScoresMessage(key);

    return;
  }

  scores = JSON.parse(scores);

  scoresToHTML(key, scores);
}

function displayNoScoresMessage(key) {
  var selector = `${getScoresSelectorNameByKey(key)} span`;

  changeElAttr(selector, 'innerText', 'No scores yet');
}

function scoresToHTML(key, scores) {
  var strHTML = '';
  var selector = `${getScoresSelectorNameByKey(key)} .scores-list`;

  for (var i = 0; i < scores.length; i++) {
    strHTML += `\t<li>${scores[i]}</li>\n`;
  }

  changeElAttr(selector, 'innerHTML', strHTML);
}

function getScoresSelectorNameByKey(key) {
  switch (key) {
    case EASY_SCORES_KEY:
      return '#easy-scores';
    case MEDIUM_SCORES_KEY:
      return '#medium-scores';
    case HARD_SCORES_KEY:
      return '#hard-scores';
  }
}

function addScore(score, level) {
  switch (level.SIZE) {
    case 4:
      addScoreToLocalStorage(EASY_SCORES_KEY, secsToString(score));
      renderScores(EASY_SCORES_KEY);

      break;
    case 8:
      addScoreToLocalStorage(MEDIUM_SCORES_KEY, secsToString(score));
      renderScores(MEDIUM_SCORES_KEY);

      break;
    case 12:
      addScoreToLocalStorage(HARD_SCORES_KEY, secsToString(score));
      renderScores(HARD_SCORES_KEY);

      break;
  }
}

function addScoreToLocalStorage(key, value) {
  var scores = localStorage.getItem(key);

  if (scores) {
    scores = JSON.parse(scores);
  } else {
    scores = [];
  }

  scores.push(value);
  scores.sort();

  if (scores.length > 5) scores.pop();

  localStorage.setItem(key, JSON.stringify(scores));
}
