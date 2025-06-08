// favourites.js: Renders user's favourite books
document.addEventListener('DOMContentLoaded', function() {
    const favList = document.getElementById('favourites-list');
    fetch('data/books.json')
        .then(res => res.json())
        .then(data => {
            const allBooks = data.books;
            const favIds = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
            const favBooks = allBooks.filter(b => favIds.includes(b.id));
            if (!favBooks.length) {
                favList.innerHTML = `<p>No favourite books added yet.</p>`;
                return;
            }
            favBooks.forEach(book => {
                favList.innerHTML += `
                <div class="book-card" data-id="${book.id}" onclick="location.href='book.html?id=${book.id}'">
                  <img src="assets/images/covers/${book.cover}" class="book-cover" alt="${book.title}">
                  <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-desc">${book.description}</div>
                  </div>
                </div>`;
            });
        });
});