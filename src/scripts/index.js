import '../styles/styles.css';
import App from './pages/app';
import Swal from 'sweetalert2';
import { isLoggedIn, logout as clearSession } from './utils/auth.js';
import { NotificationToggle } from './components/notification-toggle.js';
import { renderFooterDropUp } from './pages/templates/footer.js';

document.addEventListener('DOMContentLoaded', () => {
    renderFooterDropUp();
});

document.addEventListener('DOMContentLoaded', async () => {
    const toggle = new NotificationToggle(
        'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk',
    );
    await toggle.afterRender();
});

function handleLogout() {
    clearSession();

    Swal.fire({
        icon: 'success',
        title: 'Berhasil logout!',
        showConfirmButton: false,
        timer: 1000,
    });

    updateAuthUI();
    window.location.hash = '#/login';
}

function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.querySelector('a[href="#/register"]');
    const logoutButton = document.getElementById('logoutButton');
    const authRequiredItems = document.querySelectorAll('.auth-required');

    if (!loginLink || !logoutButton) return;

    if (isLoggedIn()) {
        loginLink.style.display = 'inline-block';
        logoutButton.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'none';

        authRequiredItems.forEach((item) => {
            item.style.display = 'list-item';
        });

        loginLink.style.display = 'none';
    } else {
        loginLink.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        if (registerLink) registerLink.style.display = 'inline-block';

        authRequiredItems.forEach((item) => {
            item.style.display = 'none';
        });
    }
}

document.addEventListener('DOMContentLoaded', async () => {
    const app = new App({
        content: document.querySelector('#main-content'),
        drawerButton: document.querySelector('#drawer-button'),
        navigationDrawer: document.querySelector('#navigation-drawer'),
    });

    const logoutButton = document.getElementById('logoutButton');
    if (logoutButton) {
        logoutButton.addEventListener('click', handleLogout);
    }

    updateAuthUI();
    await app.renderPage();

    window.addEventListener('hashchange', async () => {
        await app.renderPage();
        updateAuthUI();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const mainContent = document.querySelector('#main-content');
    const skipLink = document.querySelector('.skip-link');

    if (skipLink && mainContent) {
        skipLink.addEventListener('click', function (event) {
            event.preventDefault();
            skipLink.blur();

            mainContent.setAttribute('tabindex', '-1');
            mainContent.focus();
            mainContent.scrollIntoView();
        });
    }
});
