function PlayManuallyBoard() {
  gGame.markedCount = 0;
  gGame.mode = 'PLAYING';

  deactivatePlayButton();
  hideAllCells(gBoard);
  renderBoard(gBoard);
  renderMinesLeft();
  startGameManually();
}

function resetManuallyMode() {
  gGame.markedCount = 0;
  gBoard = buildBoard(gLevel.SIZE);

  deactivatePlayButton();
  renderBoard(gBoard);
}

function toggleManuallyBoard() {
  switch (gGame.mode) {
    case 'MANUALLY_BOARD':
      reset();
      resetManuallyButtons();

      gGame.mode = 'INITIAL';

      break;
    default:
      reset();
      renderManuallyButtons();

      gGame.mode = 'MANUALLY_BOARD';

      break;
  }
}

function initManuallyButtons() {
  changeElStyleAttr('.app-header-container #create-manually-button', 'visibility', 'visible');
}

function renderManuallyButtons() {
  changeElStyleAttr('.app-header-container #play-manually-button', 'visibility', 'visible');
  deactivatePlayButton();
}

function resetManuallyButtons() {
  changeElStyleAttr('.app-header-container #play-manually-button', 'visibility', 'hidden');
}

function activatePlayButton() {
  changeElAttr('.app-header-container #play-manually-button', 'disabled', false);
}

function deactivatePlayButton() {
  changeElAttr('.app-header-container #play-manually-button', 'disabled', true);
}
