// books.js: Handles book loading, filtering, search, and rendering
let allBooks = [];
const booksList = document.getElementById('books-list');
const genreFilter = document.getElementById('genre-filter');
const authorFilter = document.getElementById('author-filter');
const yearFilter = document.getElementById('year-filter');
const searchBar = document.getElementById('search-bar');

function loadBooks() {
    fetch('data/books.json')
        .then(res => res.json())
        .then(data => {
            allBooks = data.books;
            populateFilters();
            renderBooks(allBooks);
        });
}

function populateFilters() {
    // Fill genre, author, year filters
    const genres = [...new Set(allBooks.map(b => b.genre))].sort();
    const authors = [...new Set(allBooks.map(b => b.author))].sort();
    const years = [...new Set(allBooks.map(b => b.year))].sort((a, b) => b-a);
    genres.forEach(g => genreFilter.innerHTML += `<option value="${g}">${g}</option>`);
    authors.forEach(a => authorFilter.innerHTML += `<option value="${a}">${a}</option>`);
    years.forEach(y => yearFilter.innerHTML += `<option value="${y}">${y}</option>`);
}

function renderBooks(books) {
    if (!booksList) return;
    booksList.innerHTML = "";
    if (!books.length) {
        booksList.innerHTML = `<p>No books found.</p>`;
        return;
    }
    const favs = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
    books.forEach(book => {
        booksList.innerHTML += `
        <div class="book-card" data-id="${book.id}" onclick="showBookDetail(event, '${book.id}')">
          <img src="assets/images/covers/${book.cover}" class="book-cover" alt="${book.title}">
          <div class="book-info">
            <div class="book-title">${book.title}</div>
            <div class="book-author">by ${book.author}</div>
            <div class="book-desc">${book.description}</div>
            <div class="book-actions">
              <button class="fav-btn${favs.includes(book.id) ? ' favourited' : ''}" title="Add to Favourites" onclick="toggleFavourite(event, '${book.id}')">♥</button>
            </div>
          </div>
        </div>`;
    });
}

window.showBookDetail = function(event, id) {
    // Prevent card click from firing when clicking button
    if (event.target.classList.contains('fav-btn')) return;
    location.href = `book.html?id=${id}`;
};

window.toggleFavourite = function(event, id) {
    event.stopPropagation();
    let favs = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
    if (favs.includes(id)) {
        favs = favs.filter(fid => fid !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem('elibrary-favourites', JSON.stringify(favs));
    renderBooks(filteredBooks());
};

function filteredBooks() {
    let books = [...allBooks];
    // Filter
    if (genreFilter.value) books = books.filter(b => b.genre === genreFilter.value);
    if (authorFilter.value) books = books.filter(b => b.author === authorFilter.value);
    if (yearFilter.value) books = books.filter(b => b.year == yearFilter.value);
    // Search
    const query = (searchBar.value || "").toLowerCase();
    if (query)
        books = books.filter(b =>
            b.title.toLowerCase().includes(query) ||
            b.author.toLowerCase().includes(query) ||
            b.genre.toLowerCase().includes(query)
        );
    return books;
}

if (booksList) {
    loadBooks();
    [genreFilter, authorFilter, yearFilter, searchBar].forEach(el => {
        if (!el) return;
        el.addEventListener('input', () => renderBooks(filteredBooks()));
    });
}