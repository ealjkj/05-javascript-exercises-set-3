let modalContainer = document.getElementById('modal-container');
let modalBtn = document.getElementById('display-modal-btn');

modalContainer.addEventListener('click', e => {
    let box = e.target.closest('.modal-box');
    if(!box) document.body.removeChild(modalContainer);
})

modalBtn.addEventListener('click', ()=> {
    document.body.appendChild(modalContainer);
})
