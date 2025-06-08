// favourites.js: Renders user's favourite books from Google Books API
document.addEventListener('DOMContentLoaded', function() {
    const favList = document.getElementById('favourites-list');
    const favIds = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
    if (!favIds.length) {
        favList.innerHTML = `<p>No favourite books added yet.</p>`;
        return;
    }
    favList.innerHTML = "<p>Loading your favourites...</p>";
    // Fetch each book by ID
    Promise.all(
        favIds.map(id =>
            fetch(`https://www.googleapis.com/books/v1/volumes/${id}`)
                .then(res => res.json())
                .catch(() => null)
        )
    ).then(results => {
        favList.innerHTML = '';
        results.forEach(item => {
            if (!item || !item.id) return;
            const book = {
                id: item.id,
                title: item.volumeInfo.title || "No Title",
                author: (item.volumeInfo.authors && item.volumeInfo.authors[0]) || "Unknown",
                genre: (item.volumeInfo.categories && item.volumeInfo.categories[0]) || "Unknown",
                year: (item.volumeInfo.publishedDate && item.volumeInfo.publishedDate.slice(0, 4)) || "N/A",
                cover: (item.volumeInfo.imageLinks && item.volumeInfo.imageLinks.thumbnail) || "assets/images/covers/book1.jpg",
                description: item.volumeInfo.description || "No description available."
            };
            favList.innerHTML += `
                <div class="book-card" data-id="${book.id}" onclick="location.href='book.html?id=${book.id}'">
                  <img src="${book.cover}" class="book-cover" alt="${book.title}">
                  <div class="book-info">
                    <div class="book-title">${book.title}</div>
                    <div class="book-author">by ${book.author}</div>
                    <div class="book-desc">${book.description}</div>
                  </div>
                </div>`;
        });
        if (favList.innerHTML === '') {
            favList.innerHTML = "<p>No valid favourite books found.</p>";
        }
    });
});