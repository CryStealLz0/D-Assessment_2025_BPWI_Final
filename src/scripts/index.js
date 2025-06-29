import '../styles/styles.css';
import App from './pages/app';
import Swal from 'sweetalert2';
import { isLoggedIn, logout as clearSession } from './utils/auth.js';
import { NotificationToggle } from './components/notification-toggle.js';
import { renderFooterDropUp } from './pages/templates/footer.js';

document.addEventListener('DOMContentLoaded', async () => {
    renderFooterDropUp();

    // 1. Register SW dulu agar bisa langsung jadi controller
    if ('serviceWorker' in navigator) {
        try {
            const reg = await navigator.serviceWorker.register(
                '/service-worker.js',
            );
            console.log('✅ Service Worker registered:', reg);

            // Reload otomatis jika belum dikontrol oleh SW
            if (!navigator.serviceWorker.controller) {
                console.warn(
                    '⚠️ Service Worker belum mengontrol halaman. Reload...',
                );
                window.location.reload(); // ini hanya jalan sekali
            }
        } catch (err) {
            console.error('❌ Service Worker failed:', err);
        }
    }

    // 2. Notifikasi toggle
    const toggle = new NotificationToggle(
        'BCCs2eonMI-6H2ctvFaWg-UYdDv387Vno_bzUzALpB442r2lCnsHmtrx8biyPi_E-1fSGABK_Qs_GlvPoJJqxbk',
    );
    await toggle.afterRender();

    // 3. Inisialisasi App
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

    // const testPushBtn = document.querySelector('#btn-test-push');
    // const logEl = document.querySelector('#subscription-log');

    // if (testPushBtn && logEl) {
    //     const reg = await navigator.serviceWorker.ready;
    //     const sub = await reg.pushManager.getSubscription();

    //     if (sub) {
    //         logEl.textContent = JSON.stringify(sub.toJSON(), null, 2);
    //     } else {
    //         logEl.textContent = 'Belum berlangganan notifikasi.';
    //     }

    //     testPushBtn.addEventListener('click', () => {
    //         if (navigator.serviceWorker.controller) {
    //             navigator.serviceWorker.controller.postMessage({
    //                 type: 'test-push',
    //                 title: 'Tes Notifikasi dari StoryMapKita',
    //                 body: 'Notifikasi ini dikirim dari halaman ke Service Worker.',
    //             });
    //         } else {
    //             console.warn('Service Worker belum mengontrol halaman.');
    //         }
    //     });
    // }
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
