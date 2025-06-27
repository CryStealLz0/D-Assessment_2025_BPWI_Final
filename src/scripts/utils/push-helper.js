export async function registerServiceWorker() {
    if (!('serviceWorker' in navigator)) return null;
    return await navigator.serviceWorker.register('/service-worker.js');
}

export async function getSubscription(registration, vapidPublicKey) {
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') throw new Error('Izin notifikasi ditolak');

    return await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPublicKey),
    });
}

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    return Uint8Array.from([...rawData].map((char) => char.charCodeAt(0)));
}
