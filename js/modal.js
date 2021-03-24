function closeModal() {
  setModel('', 'hidden');
}

function showModal(text) {
  setModel(text, 'visible');
}

function setModel(text, visibility) {
  var elModal = document.querySelector('.modal');

  elModal.innerText = text;
  elModal.style.visibility = visibility;
}

