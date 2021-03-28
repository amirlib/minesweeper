function closeModal() {
  setModel('', 'hidden');
}

function showModal(text) {
  setModel(text, 'visible');
}

function setModel(text, visibility) {
  changeElAttr('.modal', 'innerText', text);
  changeElStyleAttr('.modal', 'visibility', visibility);
}

