const bookForm = document.getElementById('bookForm');
const bookList = document.getElementById('bookList');
const message = document.getElementById('message');
const bookId = document.getElementById('bookId');
const title = document.getElementById('title');
const author = document.getElementById('author');
const price = document.getElementById('price');
const submitBtn = document.getElementById('submitBtn');
const cancelBtn = document.getElementById('cancelBtn');

// Display message
function showMessage(text) {
    message.textContent = text;
}

// GET - Display all books
async function loadBooks() {
    try {
        const response = await fetch('/books');

        if (!response.ok) {
            throw new Error('Failed to fetch books');
        }

        const books = await response.json();

        bookList.innerHTML = '';

        books.forEach(book => {
            const row = document.createElement('tr');

            const idCell = document.createElement('td');
            idCell.textContent = book.id;

            const titleCell = document.createElement('td');
            titleCell.textContent = book.title;

            const authorCell = document.createElement('td');
            authorCell.textContent = book.author;

            const priceCell = document.createElement('td');
            priceCell.textContent = book.price;

            const actionCell = document.createElement('td');

            const editButton = document.createElement('button');
            editButton.textContent = 'Edit';
            editButton.className = 'edit-btn';
            editButton.onclick = () => editBook(book);

            const deleteButton = document.createElement('button');
            deleteButton.textContent = 'Delete';
            deleteButton.className = 'delete-btn';
            deleteButton.onclick = () => deleteBook(book.id);

            actionCell.append(editButton, deleteButton);
            row.append(idCell, titleCell, authorCell, priceCell, actionCell);

            bookList.appendChild(row);
        });

    } catch (error) {
        showMessage(error.message);
    }
}

// POST and PUT - Add or update a book
bookForm.addEventListener('submit', async function(e) {
    e.preventDefault();

    const bookData = {
        title: title.value.trim(),
        author: author.value.trim(),
        price: price.value
    };

    try {
        const id = bookId.value;

        const response = await fetch(id ? `/books/${id}` : '/books', {
            method: id ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(bookData)
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        showMessage(result.message);

        bookForm.reset();
        bookId.value = '';
        submitBtn.textContent = 'Add Book';
        cancelBtn.hidden = true;

        loadBooks();

    } catch (error) {
        showMessage(error.message);
    }
});

// Edit a book
function editBook(book) {
    bookId.value = book.id;
    title.value = book.title;
    author.value = book.author;
    price.value = book.price;

    submitBtn.textContent = 'Update Book';
    cancelBtn.hidden = false;

    showMessage('Editing book ID: ' + book.id);
}

// DELETE - Delete a book
async function deleteBook(id) {
    if (!confirm('Are you sure you want to delete this book?')) {
        return;
    }

    try {
        const response = await fetch(`/books/${id}`, {
            method: 'DELETE'
        });

        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message);
        }

        showMessage(result.message);
        loadBooks();

    } catch (error) {
        showMessage(error.message);
    }
}

// Cancel edit
cancelBtn.addEventListener('click', function() {
    bookForm.reset();
    bookId.value = '';
    submitBtn.textContent = 'Add Book';
    cancelBtn.hidden = true;
    showMessage('');
});

// Load books when webpage opens
loadBooks();