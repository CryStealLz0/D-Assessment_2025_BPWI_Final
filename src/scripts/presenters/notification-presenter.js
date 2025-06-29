export class NotificationPresenter {
    constructor(repository, view) {
        this.repository = repository;
        this.view = view;
    }

    async subscribe(subscription) {
        try {
            const { endpoint, keys } = subscription.toJSON();
            await this.repository.subscribe({ endpoint, keys });
            this.view.showSuccess('Berhasil berlangganan notifikasi!');
        } catch (error) {
            this.view.showError(error.message || 'Gagal berlangganan.');
        }
    }

    async unsubscribe(subscription) {
        try {
            await this.repository.unsubscribe(subscription.endpoint);
            this.view.showSuccess('Berhasil berhenti berlangganan notifikasi!');
        } catch (error) {
            this.view.showError(
                error.message || 'Gagal berhenti berlangganan.',
            );
        }
    }
}
