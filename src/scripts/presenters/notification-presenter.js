export class NotificationPresenter {
    constructor(repository, view) {
        this.repository = repository;
        this.view = view;
    }

    async subscribe(subscription) {
        try {
            const data = {
                endpoint: subscription.endpoint,
                keys: subscription.toJSON().keys,
            };
            await this.repository.subscribe(data);
            this.view.showSuccess('Berhasil berlangganan notifikasi!');
        } catch (error) {
            this.view.showError(error.message);
        }
    }

    async unsubscribe(subscription) {
        try {
            await this.repository.unsubscribe(subscription.endpoint);
            this.view.showSuccess('Berhasil berhenti berlangganan notifikasi!');
        } catch (error) {
            this.view.showError(error.message);
        }
    }
}
