// auth.js: Handles login and profile display
document.addEventListener('DOMContentLoaded', function() {
    // Login form
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.onsubmit = function(e) {
            e.preventDefault();
            const username = document.getElementById('username').value.trim();
            const password = document.getElementById('password').value;
            const errorDiv = document.getElementById('login-error');
            // Demo: user=user, password=password
            if (username === 'user' && password === 'password') {
                localStorage.setItem('elibrary-user', JSON.stringify({
                    username: 'user',
                    email: 'user@elibrary.com',
                    lastLogin: new Date().toLocaleString()
                }));
                errorDiv.textContent = '';
                location.href = 'profile.html';
            } else {
                errorDiv.textContent = 'Invalid username or password!';
            }
        };
    }
    // Profile page
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const totalBooks = document.getElementById('total-books');
    const lastLogin = document.getElementById('last-login');
    if (profileUsername && profileEmail) {
        const user = JSON.parse(localStorage.getItem('elibrary-user') || 'null');
        if (!user) {
            location.href = 'login.html';
        } else {
            profileUsername.textContent = user.username;
            profileEmail.textContent = user.email;
            if (lastLogin) lastLogin.textContent = user.lastLogin || '-';
            // Count favourites
            const favs = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
            if (totalBooks) totalBooks.textContent = favs.length;
        }
    }
    // Logout
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('elibrary-user');
            location.href = 'login.html';
        };
    }
});