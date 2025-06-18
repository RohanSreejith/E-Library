// auth.js: Handles login, profile display, and account details section
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
    // Profile page display and account details
    const profileUsername = document.getElementById('profile-username');
    const profileEmail = document.getElementById('profile-email');
    const profileAvatar = document.getElementById('profile-avatar');
    const totalBooks = document.getElementById('total-books');
    const lastLogin = document.getElementById('last-login');
    const accountForm = document.getElementById('account-details-form');
    const accountMsg = document.getElementById('account-details-message');
    if (profileUsername && profileEmail) {
        let user = JSON.parse(localStorage.getItem('elibrary-user') || 'null');
        if (!user) {
            location.href = 'login.html';
        } else {
            profileUsername.textContent = user.username || '';
            profileEmail.textContent = user.email || '';
            if (lastLogin) lastLogin.textContent = user.lastLogin || '-';
            // Count favourites
            const favs = JSON.parse(localStorage.getItem('elibrary-favourites') || '[]');
            if (totalBooks) totalBooks.textContent = favs.length;
            // Account Details Section
            if (accountForm) {
                // Load previous details if available
                const account = JSON.parse(localStorage.getItem('elibrary-account') || '{}');
                accountForm.firstName.value = account.firstName || '';
                accountForm.lastName.value = account.lastName || '';
                accountForm.accountEmail.value = account.accountEmail || user.email || '';
                accountForm.phone.value = account.phone || '';
                accountForm.address.value = account.address || '';
                accountForm.onsubmit = function(e) {
                    e.preventDefault();
                    // Save details to localStorage
                    const newAccount = {
                        firstName: accountForm.firstName.value.trim(),
                        lastName: accountForm.lastName.value.trim(),
                        accountEmail: accountForm.accountEmail.value.trim(),
                        phone: accountForm.phone.value.trim(),
                        address: accountForm.address.value.trim()
                    };
                    localStorage.setItem('elibrary-account', JSON.stringify(newAccount));
                    accountMsg.style.color = "#2e7d32";
                    accountMsg.textContent = "Account details saved!";
                    setTimeout(() => accountMsg.textContent = '', 2000);
                };
            }
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