import CONFIG from '../config.js';

export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return null;

    return await navigator.serviceWorker
        .register('/service-worker.js')
        .then((reg) => {
            console.log('✅ Service Worker registered', reg);
            return reg;
        })
        .catch((err) => {
            console.error('❌ Service Worker registration failed:', err);
        });
}

export async function getSubscription(registration, vapidPublicKey) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Izin notifikasi ditolak');

    return await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
}

export async function sendSubscriptionToServer(subscription, token) {
    const response = await fetch(`${CONFIG.BASE_URL}${CONFIG.SUBSCRIBE}`, {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
    });
    return response.json();
}

export async function unsubscribePush(subscription, token) {
    await fetch(`${CONFIG.BASE_URL}${CONFIG.SUBSCRIBE}`, {
        method: 'DELETE',
        headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            endpoint: subscription.endpoint,
        }),
    });

    await subscription.unsubscribe();
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
