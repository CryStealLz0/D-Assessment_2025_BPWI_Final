import { NotificationPresenter } from '../presenters/notification-presenter.js';
import { NotificationRepository } from '../data/notification-repository.js';
import Swal from 'sweetalert2';

export class NotificationToggle {
    constructor(vapidKey) {
        this.vapidKey = vapidKey;
        this.toggleEl = document.querySelector('#notification-toggle');
        this.textEl = document.querySelector('#subscribe-text');
        this.iconEl = document.querySelector('#subscribe-icon');
    }

    async afterRender() {
        if (!this.toggleEl || !this.textEl || !this.iconEl) return;

        const presenter = new NotificationPresenter(
            new NotificationRepository(),
            {
                showSuccess: (msg) => console.log(msg),
                showError: (msg) => console.error(msg),
            },
        );

        // 🔔 Tampilkan dialog jika belum pernah diminta izin
        if (Notification.permission === 'default') {
            const result = await Swal.fire({
                icon: 'info',
                title: 'Aktifkan Notifikasi?',
                text: 'Ingin mendapatkan pemberitahuan terbaru dari kami?',
                showCancelButton: true,
                confirmButtonText: 'Aktifkan',
                cancelButtonText: 'Nanti saja',
            });

            if (result.isConfirmed) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission === 'granted') {
                        // ✅ Langsung aktifkan toggle & subscribe
                        localStorage.setItem('notif-toggle-enabled', true);
                        this.updateUI(true);
                        await this.tryAutoSubscribe(presenter);
                    }
                } catch (err) {
                    console.warn('Gagal meminta izin notifikasi:', err);
                }
            }
        }

        let isEnabled = localStorage.getItem('notif-toggle-enabled') === 'true';
        this.updateUI(isEnabled);

        if (isEnabled) {
            await this.tryAutoSubscribe(presenter);
        }

        this.toggleEl.addEventListener('click', async () => {
            isEnabled = !isEnabled;
            localStorage.setItem('notif-toggle-enabled', isEnabled);
            this.updateUI(isEnabled);

            if (isEnabled) {
                try {
                    const permission = await Notification.requestPermission();
                    if (permission !== 'granted')
                        throw new Error('Izin ditolak');

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
                    isEnabled = false;
                    localStorage.setItem('notif-toggle-enabled', false);
                    this.updateUI(false);
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
                        title: 'Berhenti Langganan',
                        text: 'Kamu telah mematikan notifikasi.',
                        timer: 2000,
                        showConfirmButton: false,
                    });
                } catch (err) {
                    console.error('Gagal unsubscribe', err);
                }
            }
        });
    }

    updateUI(isEnabled) {
        const textEl = this.textEl;
        const iconEl = this.iconEl;

        textEl.textContent = isEnabled ? 'Unsubscribe' : 'Subscribe';
        iconEl.textContent = isEnabled ? '🔕' : '🔔';

        if (window.innerWidth < 1000) {
            textEl.style.color = isEnabled ? '#00adb5' : 'black';
        } else {
            textEl.style.color = isEnabled ? '#00adb5' : 'white';
        }

        textEl.style.fontSize = '1rem';
        iconEl.style.transition = 'all 0.3s ease';
    }

    async tryAutoSubscribe(presenter) {
        try {
            const permission = Notification.permission;
            if (permission !== 'granted') throw new Error('Izin ditolak');

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
            localStorage.setItem('notif-toggle-enabled', false);
            this.updateUI(false);
        }
    }
}
