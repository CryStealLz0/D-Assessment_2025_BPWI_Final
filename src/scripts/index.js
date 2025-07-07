import '../styles/styles.css';
import App from './pages/app';
import Swal from 'sweetalert2';
import CONFIG from './config.js';
import { isLoggedIn, logout as clearSession } from './utils/auth.js';
import { NotificationToggle } from './components/notification-toggle.js';
import { renderFooterDropUp } from './pages/templates/footer.js';

let hasInitializedNotification = false;

document.addEventListener('DOMContentLoaded', async () => {
    renderFooterDropUp();

    if ('serviceWorker' in navigator) {
        try {
            const reg = await navigator.serviceWorker.register('/sw.js');
            console.log('✅ Service Worker registered:', reg);

            if (!navigator.serviceWorker.controller) {
                console.warn(
                    '⚠️ Service Worker belum mengontrol halaman. Reload...',
                );
                window.location.reload();
            }
        } catch (err) {
            console.error('❌ Service Worker failed:', err);
        }
    }

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
    await tryInitNotificationToggle();

    window.addEventListener('hashchange', async () => {
        await app.renderPage();
        updateAuthUI();
        await tryInitNotificationToggle();
    });
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
    hasInitializedNotification = false;
}

function updateAuthUI() {
    const loginLink = document.getElementById('loginLink');
    const registerLink = document.querySelector('a[href="#/register"]');
    const logoutButton = document.getElementById('logoutButton');
    const authRequiredItems = document.querySelectorAll('.auth-required');

    if (!loginLink || !logoutButton) return;

    if (isLoggedIn()) {
        loginLink.style.display = 'none';
        logoutButton.style.display = 'inline-block';
        if (registerLink) registerLink.style.display = 'none';
        authRequiredItems.forEach((item) => (item.style.display = 'list-item'));
    } else {
        loginLink.style.display = 'inline-block';
        logoutButton.style.display = 'none';
        if (registerLink) registerLink.style.display = 'inline-block';
        authRequiredItems.forEach((item) => (item.style.display = 'none'));
    }
}

async function tryInitNotificationToggle() {
    if (isLoggedIn() && !hasInitializedNotification) {
        const toggle = new NotificationToggle(CONFIG.VAPID_PUBLIC_KEY);
        await toggle.afterRender();
        hasInitializedNotification = true;
    }
}
