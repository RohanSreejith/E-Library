// bookdetail.js: Load and render Google Book details by ID in URL
document.addEventListener('DOMContentLoaded', function() {
    const params = new URLSearchParams(location.search);
    const id = params.get('id');
    const details = document.getElementById('book-details');
    if (!id) {
        details.innerHTML = `<p>Book not found.</p>`;
        return;
    }
    fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
        .then(res => res.json())
        .then(item => {
            if (!item || !item.id) {
                details.innerHTML = `<p>Book not found.</p>`;
                return;
            }
            const book = {
                id: item.id,
                title: item.volumeInfo.title || "No Title",
                author: (item.volumeInfo.authors && item.volumeInfo.authors[0]) || "Unknown",
                genre: (item.volumeInfo.categories && item.volumeInfo.categories[0]) || "Unknown",
                year: (item.volumeInfo.publishedDate && item.volumeInfo.publishedDate.slice(0, 4)) || "N/A",
                cover: (item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail) || "assets/images/covers/book1.jpg",
                description: item.volumeInfo.description || "No description available."
            };
            const favs = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
            details.innerHTML = `
                <img src="${book.cover}" class="book-cover" style="width:180px;max-width:100%;margin-bottom:1em;" alt="${book.title}">
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