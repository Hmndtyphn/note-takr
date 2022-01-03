// defining each for query selector
let noteTitle;
let noteBody;
let saveNoteBtn;
let createNoteBtn;
let noteList;

// if statement to use each function
if (window.location.pathname === '/notes') {
  noteTitle = document.querySelector('.note-title');
  noteBody = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  createNoteBtn = document.querySelector('.new-note');
  noteList = document.querySelectorAll('.list-container .list-group');
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

// Get note method
const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // save note method func
const saveNote = (note) =>
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
  hide(saveNoteBtn);

  // if active note is applicable
  if (activeNote.id) {
    noteTitle.setAttribute('readonly', true);
    noteBody.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteBody.value = activeNote.text;
  } else {
    // else render empty note
    noteTitle.removeAttribute('readonly');
    noteBody.removeAttribute('readonly');
    noteTitle.value = '';
    noteBody.value = '';
  }
};

// note data pulled from user input, saved to db
const handleNoteSave = () => {
  const createNote = {
    title: noteTitle.value,
    text: noteBody.value,
  };
  saveNote(createNote).then(() => {
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
  if (!noteTitle.value.trim() || !noteBody.value.trim()) {
    // this hides
    hide(saveNoteBtn);
    // this saves when ready
  } else {
    show(saveNoteBtn);
  }
};

// populate note titles list
const renderNoteList = async (notes) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the left sidebar for further use
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  createNoteBtn.addEventListener('click', handleNewNoteView);
  noteTitle.addEventListener('keyup', handleRenderSaveBtn);
  noteBody.addEventListener('keyup', handleRenderSaveBtn);
}

// gets and renders all note data.
getAndRenderNotes();
