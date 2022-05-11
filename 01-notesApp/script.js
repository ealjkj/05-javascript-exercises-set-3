'use-strict';
let createNoteBtn = document.getElementById('new-note-btn');
let noteTemplate = document.getElementById('note-template').content;
let noteContainer = document.getElementById('note-container');

let modalContainer = document.getElementById('modal-template').content.querySelector('#modal-container');
let modalBox = modalContainer.querySelector('.modal-box');
let fragment = new DocumentFragment();
let numberId = Number(location.hash.slice(1));
let notes = {};
let currentNote;

if(!localStorage.currentId) localStorage.currentId = 0;
if(localStorage.notes) notes = JSON.parse(localStorage.notes); 

// Load all notes
for(id in notes){
    createNote(notes[id], id, fragment);
}
noteContainer.appendChild(fragment);

//append events
noteContainer.addEventListener('click', noteInteraction);
modalContainer.addEventListener('mousedown', modalInteraction); 

//If valid hash detected, click on that note
if(numberId in notes) document.querySelector(`[data-id="${numberId}"]`).click();

addEventListener('hashchange', ()=>{
    numberId = Number(location.hash.slice(1));
    if(numberId in notes) document.querySelector(`[data-id="${numberId}"]`).click();
    else document.body.removeChild(modalContainer);
})



// Functions!
function loadEditor(title, text, lastEditDate, creationDate) {
    let textElement = modalBox.querySelector('#box-text-input')
    document.body.appendChild(modalContainer);

    modalBox.querySelector('#box-title-input').value = title;
    modalBox.querySelector('#box-last-edit').textContent = `Last edit: ${lastEditDate}`;
    modalBox.querySelector('#box-creation-date').textContent = `Creation date: ${creationDate}`;
    
    //Setting the text and the right size
    textElement.value = text;
    textElement.oninput();
}

function noteInteraction(e) {
    let note = e.target.closest('.note');
    let del = e.target.closest('#delete-note');
    //delete
    if(del) {
        let id = note.getAttribute('data-id');
        delete notes[id];
        localStorage.notes = JSON.stringify(notes);
        noteContainer.removeChild(note);
        return;
    }
    // edit
    if(note) {
        let id = note.getAttribute('data-id');
        loadEditor(notes[id].title, notes[id].text, notes[id].lastEditDate, notes[id].creationDate);
        currentNote = note;
        location.hash = id;
        return;
    }
    // create
    let btn = e.target.closest('#new-note-btn');
    if(btn) {
        loadEditor('', '', '', '');
        localStorage.currentId = Number(localStorage.currentId) + 1;
        let newNoteId = localStorage.currentId;
        let today = new Date();
        location.hash = newNoteId;

        //create new note
        notes[newNoteId] = {title: '', text: ''};
        notes[newNoteId].creationDate = formatDate(today);
        notes[newNoteId].lastEditDate = formatDate(today);

        currentNote = createNote(notes[newNoteId], Number(localStorage.currentId), noteContainer, createNoteBtn); 
    }
}

function modalInteraction(e) {
    let box = e.target.closest('.modal-box');
    let back = e.target.closest('.back-btn');
    if(!box || back) {
        //Update data
        let id = Number(location.hash.slice(1));
        notes[id].title = modalBox.querySelector('#box-title-input').value; 
        notes[id].text = modalBox.querySelector('#box-text-input').value;
        notes[id].lastEditDate = formatDate(new Date());
        localStorage.notes = JSON.stringify(notes);

        //
        currentNote.querySelector('.note-title').textContent = notes[id].title;
        currentNote.querySelector('.note-text').textContent = notes[id].text.slice(0, 400) + '...';
        currentNote.querySelector('.note-last-edit').textContent = `Last edit: ${notes[id].lastEditDate}`;  
        location.hash = '';   
    } 
}

function createNote(noteData, id, parent, insertAfter) {
    noteTemplate.querySelector('.note').setAttribute('data-id', id);
    noteTemplate.querySelector('.note-title').textContent = noteData.title;
    noteTemplate.querySelector('.note-text').textContent = noteData.text.slice(0, 400) + '...';
    noteTemplate.querySelector('.note-last-edit').textContent = `Last edit: ${noteData.lastEditDate}`;
    let clone = noteTemplate.cloneNode(true);
    let element = clone.querySelector('.note');
    
    if(parent.children.length === 0) parent.appendChild(clone); 
    else parent.insertBefore(clone, insertAfter ? insertAfter.nextSibling : parent.children[0]);
    
    return element;
}

function formatDate(date) {
    const DD = ('00' + date.getDate()).slice(-2);
    const MM = ('00' + (date.getMonth()+1)).slice(-2);
    const YYYY = date.getFullYear();
    const hh = date.getHours();
    const mm = date.getMinutes();
    const ss = date.getSeconds();

    return `${MM}/${DD}/${YYYY} ${hh}:${mm}:${ss}`;
}

