const arrayBook = [];
let tempArraySearchBook = [];
let tempArrayEditBook = [];
const RENDER_EVENT = 'book-event';
const SAVE_EVENT = 'book-saved';
const STORAGE_KEY = 'Bookshelf';
const RENDER_EVENT_SEARCH = 'book-search-event';

function createBookID() {
    return +new Date();
}

function createBookObject (id, title, author, year, isComplete) {
    return {
        id,
        title,
        author,
        year,
        isComplete
    }
}

function checkStorage() {
    if (typeof(Storage) === undefined) {
        alert("Browser kamu tidak mendukung local storage");
        return false;
    }
    return true;
}

function saveData() {
    if(checkStorage()) {
        const parsedData = JSON.stringify(arrayBook);
        localStorage.setItem(STORAGE_KEY, parsedData);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    if (data !== null) {
        for (const book of data) {
            arrayBook.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

function findBookIndex(bookId) {

    for (const index in arrayBook) {
        if (arrayBook[index].id === bookId) {
            return index;
        }
    }
    return null;
}

function addBook() {
    const bookName = document.getElementById('inputBookTitle').value;
    const bookAuthor = document.getElementById('inputBookAuthor').value;
    const bookYear = document.getElementById('inputBookYear').value;
    const readingStatus = document.getElementById('inputBookIsComplete').checked;

    const generateId = createBookID();
    const bookObject = createBookObject(parseInt(generateId), bookName, bookAuthor, parseInt(bookYear), readingStatus);

    arrayBook.push(bookObject);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function editBook(bookId) {

    let objectBookEdit;
    const indexBook = findBookIndex(bookId);

    if (indexBook == null) return;

    if (tempArrayEditBook.length == 0) {
        tempArrayEditBook.push(arrayBook[indexBook]);
    }
    else {
        tempArrayEditBook.splice(0, tempArrayEditBook.length);
        tempArrayEditBook.push(arrayBook[indexBook]);
    }
    
    for (const bookItem of tempArrayEditBook) {
        objectBookEdit = bookItem;
    }
    
    makeFormEdit(objectBookEdit);
}

function makeFormEdit(bookItem) {

    const changeFormHeader = document.getElementById('form-header');
    changeFormHeader.innerText = "Edit Buku";

    const getButtonClose = document.getElementById('button_close');
    const getButtonClose2 = document.getElementById('button_close_2');

    const indexBook = findBookIndex(bookItem.id);

    if (indexBook == null) return;

    document.getElementById('inputBookTitle').value = bookItem.title;
    document.getElementById('inputBookAuthor').value = bookItem.author;
    document.getElementById('inputBookYear').value = bookItem.year;
    document.getElementById('inputBookIsComplete').checked = bookItem.isComplete;

    getButtonClose.addEventListener('click', function() {
        window.location.reload();
    });

    getButtonClose2.addEventListener('click', function() {
        window.location.reload();
    });

}

function makeBook(bookObject) {
    
    const textNameBook = document.createElement('h5');
    textNameBook.innerText = bookObject.title;
    textNameBook.classList.add('fw-bold');

    const textAuthorBook = document.createElement('p');
    textAuthorBook.innerText = bookObject.author;
    textAuthorBook.classList.add('text-muted');

    const textYearBook = document.createElement('p');
    textYearBook.innerText = bookObject.year;

    const textContainer = document.createElement('article');
    textContainer.classList.add('book_item');
    textContainer.classList.add('card-text');
    textContainer.append(textNameBook, textAuthorBook, textYearBook);
    textContainer.setAttribute('id', `book-${bookObject.id}`);

    const containerCardBody = document.createElement('div');
    containerCardBody.classList.add('card-body');

    const containerCardBodyShadow = document.createElement('div');
    containerCardBodyShadow.classList.add('card');
    containerCardBodyShadow.classList.add('shadow-sm');

    const containerColumnCard = document.createElement('div');
    containerColumnCard.classList.add('col');

    if (!bookObject.isComplete) {
        const completeButton = document.createElement('button');
        completeButton.classList.add('btn');
        completeButton.classList.add('btn-sm');
        completeButton.classList.add('btn-success');
        completeButton.innerText = 'Selesai dibaca'

        completeButton.addEventListener('click', function() {
            moveBookToComplete(bookObject.id);
        });

        const editButton = document.createElement('button');
        editButton.classList.add('btn');
        editButton.classList.add('btn-sm');
        editButton.classList.add('btn-outline-primary');
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', '#exampleModal');
        editButton.innerText = 'Edit buku';

        editButton.addEventListener('click', function() {
            editBook(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-sm');
        deleteButton.classList.add('btn-outline-danger');
        deleteButton.innerText = 'Hapus buku';

        deleteButton.addEventListener('click', function() {
            deleteBook(bookObject.id);
        });

        const containerButton = document.createElement('div');
        containerButton.classList.add('btn-group');
        containerButton.append(completeButton, editButton, deleteButton);

        const containerGrupButton = document.createElement('div');
        containerGrupButton.classList.add('d-flex');
        containerGrupButton.classList.add('justify-content-between');
        containerGrupButton.classList.add('align-items-center');
        containerGrupButton.append(containerButton);

        textContainer.append(containerGrupButton);
        containerCardBody.append(textContainer);
        containerCardBodyShadow.append(containerCardBody);
        containerColumnCard.append(containerCardBodyShadow);
    }
    else {
        const unCompleteButton = document.createElement('button');
        unCompleteButton.classList.add('btn');
        unCompleteButton.classList.add('btn-sm');
        unCompleteButton.classList.add('btn-outline-success');
        unCompleteButton.innerText = 'Belum selesai'

        unCompleteButton.addEventListener('click', function() {
            moveBookToUncomplete(bookObject.id);
        })

        const editButton = document.createElement('button');
        editButton.classList.add('btn');
        editButton.classList.add('btn-sm');
        editButton.classList.add('btn-outline-primary');
        editButton.setAttribute('data-bs-toggle', 'modal');
        editButton.setAttribute('data-bs-target', '#exampleModal');
        editButton.innerText = 'Edit buku';

        editButton.addEventListener('click', function() {
            editBook(bookObject.id);
        });

        const deleteButton = document.createElement('button');
        deleteButton.classList.add('btn');
        deleteButton.classList.add('btn-sm');
        deleteButton.classList.add('btn-danger');
        deleteButton.innerText = 'Hapus buku';

        deleteButton.addEventListener('click', function() {
            deleteBook(bookObject.id);
        })

        const containerButton = document.createElement('div');
        containerButton.classList.add('btn-group');
        containerButton.append(unCompleteButton, editButton, deleteButton);

        const containerGrupButton = document.createElement('div');
        containerGrupButton.classList.add('d-flex');
        containerGrupButton.classList.add('justify-content-between');
        containerGrupButton.classList.add('align-items-center');
        containerGrupButton.append(containerButton);

        textContainer.append(containerGrupButton);
        containerCardBody.append(textContainer);
        containerCardBodyShadow.append(containerCardBody);
        containerColumnCard.append(containerCardBodyShadow);
    }

    return containerColumnCard;
}

function moveBookToComplete(bookId) {
    const indexBook = findBookIndex(bookId);
    if (indexBook == null) return;

    arrayBook[indexBook].isComplete = true;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function moveBookToUncomplete(bookId) {
    const indexBook = findBookIndex(bookId);
    if (indexBook == null) return;

    arrayBook[indexBook].isComplete = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function deleteBook(bookId) {
    const indexBook = findBookIndex(bookId);
    if (indexBook === -1) return;

    arrayBook.splice(indexBook, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function searchBook() {

    tempArraySearchBook.splice(0, arrayBook.length);

    const serializedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(serializedData);

    const titleBook = document.getElementById('searchBookTitle').value;

    if (data !== null) {
        for (index in data) {
            let getBookTitle = arrayBook[index].title;
            const parseBookTitle = getBookTitle.toLowerCase();
            if (parseBookTitle.match(titleBook.toLowerCase())) {
                tempArraySearchBook.push(arrayBook[index]);
            }
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT_SEARCH));
}

document.addEventListener('DOMContentLoaded', function() {

    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (tempArrayEditBook.length === 0) {
            addBook();
        }
        else {

            let indexBook = findBookIndex(tempArrayEditBook[0].id);

            const newTitleBook = document.getElementById('inputBookTitle').value;
            const newAuthorBook = document.getElementById('inputBookAuthor').value;
            const newYearBook = document.getElementById('inputBookYear').value;
            const getStatus = document.getElementById('inputBookIsComplete').checked;
    
            const newObjectBook = {
                id: arrayBook[indexBook].id,
                title: newTitleBook,
                author: newAuthorBook,
                year: parseInt(newYearBook),
                isComplete: getStatus
            }

            arrayBook[indexBook] = newObjectBook;

            saveData();
        }
    });

    const searchButton = document.getElementById('search_button');
    searchButton.addEventListener('click', function (event) {
        event.preventDefault();
        searchBook();
    });

    if (checkStorage()) {
        loadDataFromStorage();
    }
})

document.addEventListener(RENDER_EVENT_SEARCH, function() {

    const uncompleteReadingBook = document.getElementById('incompleteBookshelfList');
    uncompleteReadingBook.innerHTML = '';
    
    const completeReadingBook = document.getElementById('completeBookshelfList');
    completeReadingBook.innerHTML = '';

    for (const bookItem of tempArraySearchBook) {
        const makeBookElement = makeBook(bookItem)
        if (!bookItem.isComplete) {
            uncompleteReadingBook.append(makeBookElement);
        }
        else {
            completeReadingBook.append(makeBookElement);
        }
    }
})

document.addEventListener(RENDER_EVENT, function() {

    const uncompleteReadingBook = document.getElementById('incompleteBookshelfList');
    uncompleteReadingBook.innerHTML = '';
    
    const completeReadingBook = document.getElementById('completeBookshelfList');
    completeReadingBook.innerHTML = '';

    for (const bookItem of arrayBook) {
        const makeBookElement = makeBook(bookItem)
        if (!bookItem.isComplete) {
            uncompleteReadingBook.append(makeBookElement);
        }
        else {
            completeReadingBook.append(makeBookElement);
        }
    }
});