import { NotificationPresenter } from '../presenters/notification-presenter.js';
import { NotificationRepository } from '../data/notification-repository.js';
import Swal from 'sweetalert2';

export class NotificationToggle {
    constructor(vapidKey) {
        this.vapidKey = vapidKey;
        this.toggleEl = document.querySelector('#notification-toggle');
    }

    async afterRender() {
        if (!this.toggleEl) return;

        const presenter = new NotificationPresenter(
            new NotificationRepository(),
            {
                showSuccess: (msg) => console.log(msg),
                showError: (msg) => console.error(msg),
            },
        );

        // Set checkbox from localStorage
        const savedStatus =
            localStorage.getItem('notif-toggle-enabled') === 'true';
        this.toggleEl.checked = savedStatus;

        // Jika sudah aktif sebelumnya, coba subscribe ulang
        if (savedStatus) {
            try {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') {
                    this.toggleEl.checked = false;
                    localStorage.setItem('notif-toggle-enabled', false);
                    return;
                }

                const reg = await navigator.serviceWorker.ready;
                const sub = await reg.pushManager.getSubscription();

                if (!sub) {
                    const newSub = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: this.vapidKey,
                    });
                    await presenter.subscribe(newSub);
                } else {
                    await presenter.subscribe(sub);
                }
            } catch (err) {
                console.error('Gagal auto-subscribe', err);
                this.toggleEl.checked = false;
                localStorage.setItem('notif-toggle-enabled', false);
            }
        }

        // Event toggle
        this.toggleEl.addEventListener('change', async () => {
            const isEnabled = this.toggleEl.checked;
            localStorage.setItem('notif-toggle-enabled', isEnabled);

            if (isEnabled) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission !== 'granted') {
                        alert('Izin notifikasi ditolak');
                        this.toggleEl.checked = false;
                        localStorage.setItem('notif-toggle-enabled', false);
                        return;
                    }

                    const reg = await navigator.serviceWorker.ready;
                    const sub = await reg.pushManager.subscribe({
                        userVisibleOnly: true,
                        applicationServerKey: this.vapidKey,
                    });

                    await presenter.subscribe(sub);
                    Swal.fire({
                        icon: 'success',
                        title: 'Berhasil!',
                        text: 'Kamu telah berlangganan notifikasi.',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (err) {
                    console.error('Gagal subscribe', err);
                    this.toggleEl.checked = false;
                    localStorage.setItem('notif-toggle-enabled', false);
                }
            } else {
                try {
                    const reg = await navigator.serviceWorker.ready;
                    const sub = await reg.pushManager.getSubscription();
                    if (sub) {
                        await presenter.unsubscribe(sub);
                        await sub.unsubscribe();
                    }
                    Swal.fire({
                        icon: 'info',
                        title: 'Notifikasi Dimatikan',
                        text: 'Kamu telah berhenti berlangganan notifikasi.',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (err) {
                    console.error('Gagal unsubscribe', err);
                }
            }
        });
    }
}
