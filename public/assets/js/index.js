// defining each for query selector
// name of note
let noteName;
// note data
let noteInfo;
// note save button
let noteSaveBtn;
// create new note
let newNoteBtn;
// show all notes
let noteAll;

// if statement to use each function, getting note from db
if (window.location.pathname === '/notes') {
  noteName = document.querySelector('.note-title');
  noteInfo = document.querySelector('.note-textarea');
  noteSaveBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  noteAll = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem) => {
  elem.style.display = 'none';
};

// used to keep track of active note
let activeNote = {};

// Get all notes route
const noteGet = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // save note method func
const noteSave = (note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });

  // delete notes function
const deleteNote = (id) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // if there is a note currently in use, show it first
const renderActiveNote = () => {
  hide(noteSaveBtn);

  // if active note is applicable
  if (activeNote.id) {
    noteName.setAttribute('readonly', true);
    noteInfo.setAttribute('readonly', true);
    noteName.value = activeNote.title;
    noteInfo.value = activeNote.text;
  } else {

    // else render empty note
    noteName.removeAttribute('readonly');
    noteInfo.removeAttribute('readonly');
    noteName.value = '';
    noteInfo.value = '';
  }
};

// note data pulled from user input, saved to db
const handleNoteSave = () => {
  const newNote = {
    title: noteName.value,
    text: noteInfo.value,
  };

  // saves the new note
  noteSave(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete note when prompted
const handleNoteDelete = (e) => {
  e.stopPropagation();


  const note = e.target;
  const noteId = JSON.parse(note.parentElement.getAttribute('data-note')).id;

  if (activeNote.id === noteId) {
    activeNote = {};
  }

  deleteNote(noteId).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Sets the current note
const handleNoteView = (e) => {
  e.preventDefault();
  activeNote = JSON.parse(e.target.parentElement.getAttribute('data-note'));
  renderActiveNote();
};

// sets active note to empty object, creates new note
const handleNewNoteView = (e) => {
  activeNote = {};
  renderActiveNote();
};

// hides save when all fields arent filled by user
const handleRenderSaveBtn = () => {
  if (!noteName.value.trim() || !noteInfo.value.trim()) {

    // this hides
    hide(noteSaveBtn);

    // this saves when ready
  } else {
    show(noteSaveBtn);
  }
};

// populate note titles list
const renderNoteAll = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteAll.forEach((el) => (el.innerHTML = ''));
  }

  // empty array for all note items
  let noteAllItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    // spans whole note body
    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');

    // sets as text, event listener for on click of note
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    // appends listed group item (note)
    liEl.append(spanEl);

    // if statement for delete button
    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );

      // delete button event listener
      delBtnEl.addEventListener('click', handleNoteDelete);

      // append data to no longer show deleted note
      liEl.append(delBtnEl);
    }

    // return the new list
    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteAllItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteAllItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteAllItems.forEach((note) => noteAll[0].append(note));
  }
};

// Gets notes from the db and renders them to the left sidebar for further use
const getAndRenderNotes = () => noteGet().then(renderNoteAll);

// if statement for being on note page
if (window.location.pathname === '/notes') {

  // if note save is clicked
  noteSaveBtn.addEventListener('click', handleNoteSave);

  // if new note is clicked
  newNoteBtn.addEventListener('click', handleNewNoteView);

  // passes note name/ info
  noteName.addEventListener('keyup', handleRenderSaveBtn);
  noteInfo.addEventListener('keyup', handleRenderSaveBtn);
}

// gets and renders all note data.
getAndRenderNotes();
