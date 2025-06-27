import { NotificationPresenter } from '../presenters/notification-presenter.js';
import { NotificationRepository } from '../data/notification-repository.js';
import {
    registerServiceWorker,
    getSubscription,
} from '../utils/push-helper.js';

export class NotificationToggle {
    constructor(vapidKey) {
        this.vapidKey = vapidKey;
        this.presenter = new NotificationPresenter(
            new NotificationRepository(),
            this,
        );
        this.toggleElement = null;
    }

    render() {
        return `
      <div style="margin-top:1rem;">
        <label>
          <input type="checkbox" id="notification-toggle" />
          Terima Notifikasi Cerita Baru
        </label>
      </div>
    `;
    }

    async afterRender() {
        this.toggleElement = document.getElementById('notification-toggle');
        const sw = await navigator.serviceWorker.ready;
        const subscription = await sw.pushManager.getSubscription();

        this.toggleElement.checked = !!subscription;

        this.toggleElement.addEventListener('change', async () => {
            if (this.toggleElement.checked) {
                const swReg = await registerServiceWorker();
                const newSub = await getSubscription(swReg, this.vapidKey);
                await this.presenter.subscribe(newSub);
            } else {
                const sub = await sw.pushManager.getSubscription();
                if (sub) {
                    await this.presenter.unsubscribe(sub);
                    await sub.unsubscribe();
                }
            }
        });
    }

    showSuccess(msg) {
        alert(`✅ ${msg}`);
    }

    showError(msg) {
        alert(`❌ ${msg}`);
    }
}
