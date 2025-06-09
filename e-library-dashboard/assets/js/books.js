// books.js: Fetches and displays books from Google Books API

const booksList = document.getElementById('books-list');
const genreFilter = document.getElementById('genre-filter');
const authorFilter = document.getElementById('author-filter');
const yearFilter = document.getElementById('year-filter');
const searchBar = document.getElementById('search-bar');

// Helper to extract safe data from Google Books API volume
function extractBook(item) {
    return {
        id: item.id,
        title: item.volumeInfo.title || "No Title",
        author: (item.volumeInfo.authors && item.volumeInfo.authors[0]) || "Unknown",
        genre: (item.volumeInfo.categories && item.volumeInfo.categories[0]) || "Unknown",
        year: (item.volumeInfo.publishedDate && item.volumeInfo.publishedDate.slice(0, 4)) || "N/A",
        cover: (item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail) || "assets/images/covers/book1.jpg",
        description: item.volumeInfo.description || "No description available."
    };
}

let allBooks = []; // will hold the current batch for filtering

// Fetch books from Google Books API
function loadBooks(query = "programming") {
    // Max results: 30 (API limit per call is 40)
    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}&maxResults=24`)
        .then(res => res.json())
        .then(data => {
            if (!data.items) {
                booksList.innerHTML = "<p>No books found.</p>";
                return;
            }
            allBooks = data.items.map(extractBook);
            populateFilters();
            renderBooks(allBooks);
        });
}

function populateFilters() {
    // Fill genre, author, year filters from current books
    const genres = [...new Set(allBooks.map(b => b.genre))].sort();
    const authors = [...new Set(allBooks.map(b => b.author))].sort();
    const years = [...new Set(allBooks.map(b => b.year))].filter(y => y !== "N/A").sort((a, b) => b - a);
    // Reset
    genreFilter.innerHTML = '<option value="">All</option>';
    authorFilter.innerHTML = '<option value="">All</option>';
    yearFilter.innerHTML = '<option value="">All</option>';
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
          <img src="${book.cover}" class="book-cover" alt="${book.title}">
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
    loadBooks(); // initial load with "programming"
    // On search or filter change
    [genreFilter, authorFilter, yearFilter].forEach(el => {
        if (!el) return;
        el.addEventListener('input', () => renderBooks(filteredBooks()));
    });
    // Search bar triggers new API search
    if (searchBar) {
        let searchTimeout;
        searchBar.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                // If the search is empty, default to "programming"
                loadBooks(searchBar.value.trim() || "programming");
            }, 400);
        });
    }
}