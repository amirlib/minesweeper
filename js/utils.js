function changeElAttr(selector, attrName, value) {
  var el = document.querySelector(selector);

  el[attrName] = value;
}

function changeElStyleAttr(selector, attrName, value) {
  var el = document.querySelector(selector);

  el.style[attrName] = value;
}

function createCellLocationsArr(board) {
  var locations = [];

  for (var i = 0; i < board.length; i++) {
    for (var j = 0; j < board[i].length; j++) {
      locations.push({ i, j });
    }
  }

  return locations;
}

function cloneBoard(board) {
  var cloned = [];

  for (var i = 0; i < board.length; i++) {
    cloned.push([]);

    for (var j = 0; j < board[i].length; j++) {
      cloned[i].push(cloneCell(board[i][j]));
    }
  }

  return cloned;
}

function cloneCell(cell) {
  return {
    minesAroundCount: cell.minesAroundCount,
    isMarked: cell.isMarked,
    isMine: cell.isMine,
    isShown: cell.isShown,
  };
}

function getCellIdSelectorByLocation(location) {
  return `#cell-${location.i}-${location.j}`;
}

function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);

  return Math.floor(Math.random() * (max - min) + min);
}
