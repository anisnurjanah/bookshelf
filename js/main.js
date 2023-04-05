const books = [];
const RENDER_EVENT = 'render-book';
const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKS_APPS';

function generateId() {
  return +new Date();
}
 
function generateBookObject(id, title, author, year, isCompleted) {
  return {
    id,
    title,
    author,
    year,
    isCompleted
  }
}

function findBook(bookId) {
  for (const booksItem of books) {
    if (booksItem.id === bookId) {
      return booksItem;
    }
  }
  return null;
}

function findBookIndex(bookId) {
  for (const index in books) {
  if (books[index].id === bookId) {
    return index;
  }
}
  return -1;
}

function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(books);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const book of data) {
      books.push(book);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}

function makeBook(bookObject) {
  const textTitle = document.createElement('h3');
  textTitle.innerText = bookObject.title;

  const textAuthor = document.createElement('p');
  textAuthor.innerText = 'Penulis: ' + bookObject.author;
 
  const textYear = document.createElement('p');
  textYear.innerText = 'Tahun: ' + bookObject.year;
 
  const bookItems = document.createElement('div');
  bookItems.classList.add('book_item');
  bookItems.append(textTitle, textAuthor, textYear);
 
  const listBook = document.createElement('article');
  listBook.append(bookItems);
  listBook.setAttribute('id', `book-${bookObject.id}`);
  
if (bookObject.isCompleted) {
  const action = document.createElement('div');
  action.classList.add('action');

  const greenButton = document.createElement('button');
  greenButton.setAttribute('class', 'green');
  greenButton.textContent = 'Belum selesai dibaca';
  greenButton.addEventListener('click', function () {
  undoBook(bookObject.id);
});
  
  const redButton = document.createElement('button');
  redButton.setAttribute('class', 'red');
  redButton.textContent = 'Hapus Buku';
  redButton.addEventListener('click', function () {
  deleteBook(bookObject.id);
  });
  
  action.append(greenButton, redButton);
  listBook.append(action);

  } else {
  const action = document.createElement('div');
  action.classList.add('action');

  const greenBook = document.createElement('button');
  greenBook.setAttribute('class', 'green');
  greenBook.textContent = 'Selesai dibaca';
  greenBook.addEventListener('click', function () {
  doneBook(bookObject.id);
});
  
  const redBook = document.createElement('button');
  redBook.setAttribute('class', 'red');
  redBook.textContent = 'Hapus Buku';
  redBook.addEventListener('click', function () {
  deleteBook(bookObject.id);
});

  action.append(greenBook, redBook);
  listBook.append(action);
  
  }

  return listBook;
}

function addBook() {
  const textTitle = document.getElementById('title').value;
  const textAuthor = document.getElementById('author').value;
  const textYear = document.getElementById('year').value;
  const isCompleted = document.getElementById('BookIsComplete').checked;
 
  const generatedID = generateId();
  const bookObject = generateBookObject(generatedID, textTitle, textAuthor, textYear, isCompleted);
  books.push(bookObject);
 
  document.dispatchEvent(new Event(RENDER_EVENT));
  saveData();
}

  function undoBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = false;
    const uncompletedBOOKList = document.getElementById('uncompleteBooks');
    uncompletedBOOKList.innerHTML = '';
    uncompletedBOOKList.append(bookTarget);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  function deleteBook(bookId) {
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    alert('Delete the book?');
    saveData();
  }

  function doneBook(bookId) {
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;
    bookTarget.isCompleted = true;
    const completedBOOKList = document.getElementById('completeBooks');
    completedBOOKList.innerHTML = '';
    completedBOOKList.append(bookTarget);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

  document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('inputBook');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addBook();
    });
    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

  document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
  });

  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedBOOKList = document.getElementById('uncompleteBooks');
    const completedBOOKList = document.getElementById('completeBooks');

    uncompletedBOOKList.innerHTML = '';
    completedBOOKList.innerHTML = '';
 
  for (const booksItem of books) {
    const bookElement = makeBook(booksItem);
    if (!booksItem.isCompleted) {
      uncompletedBOOKList.append(bookElement);
      } else {
      completedBOOKList.append(bookElement);
    }
  }
});