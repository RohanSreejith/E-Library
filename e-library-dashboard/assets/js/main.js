// main.js: Handles dark mode, navigation, and session basics.
(function() {
    // Dark mode toggle
    const darkToggle = document.getElementById('toggle-darkmode');
    const darkStyle = document.getElementById('darkmode-style');
    function setDarkMode(enabled) {
        if (enabled) {
            darkStyle.removeAttribute('disabled');
            localStorage.setItem('elibrary-dark', '1');
        } else {
            darkStyle.setAttribute('disabled', 'true');
            localStorage.setItem('elibrary-dark', '0');
        }
    }
    if (darkToggle && darkStyle) {
        // Set on load
        setDarkMode(localStorage.getItem('elibrary-dark') === '1');
        darkToggle.onclick = () =>
            setDarkMode(darkStyle.hasAttribute('disabled'));
    }
    // Nav active link
    Array.from(document.querySelectorAll('.nav-link')).forEach(link => {
        if (link.href && link.href === location.href) link.classList.add('active');
    });
    // Auth nav (show/hide login/logout)
    const user = JSON.parse(localStorage.getItem('elibrary-user') || 'null');
    if (user) {
        let loginBtn = document.getElementById('login-btn');
        if (loginBtn) loginBtn.textContent = 'Logout';
        if (loginBtn) loginBtn.onclick = function(e) {
            e.preventDefault();
            localStorage.removeItem('elibrary-user');
            location.href = 'login.html';
        }
    }
})();