// bookdetail.js: Load and render book details by ID in URL
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const details = document.getElementById('book-details');
    if (!id) {
        details.innerHTML = `<p>Book not found.</p>`;
        return;
    }
    fetch('data/books.json')
        .then(res => res.json())
        .then(data => {
            const book = data.books.find(b => b.id === id);
            if (!book) {
                details.innerHTML = `<p>Book not found.</p>`;
                return;
            }
            // Check if in favourites
            const favs = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
            details.innerHTML = `
                <img src="assets/images/covers/${book.cover}" class="book-cover" style="width:180px;max-width:100%;margin-bottom:1em;" alt="${book.title}">
                <h2>${book.title}</h2>
                <h4>by ${book.author}</h4>
                <p><strong>Genre:</strong> ${book.genre} | <strong>Year:</strong> ${book.year}</p>
                <p>${book.description}</p>
                <button class="fav-btn${favs.includes(book.id) ? ' favourited' : ''}" onclick="toggleFavDetail('${book.id}')">${favs.includes(book.id) ? 'Remove from' : 'Add to'} Favourites</button>
            `;
        });
});

window.toggleFavDetail = function(id) {
    let favs = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
    if (favs.includes(id)) {
        favs = favs.filter(fid => fid !== id);
    } else {
        favs.push(id);
    }
    localStorage.setItem('elibrary-favourites', JSON.stringify(favs));
    location.reload();
};