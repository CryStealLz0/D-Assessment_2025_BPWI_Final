export class RegisterPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async registerUser(name, email, password) {
        try {
            if (!name || !email || !password) {
                this.view.showErrorMessage('Semua kolom wajib diisi.');
                return;
            }

            this.view.showLoading();
            await this.model.register(name, email, password);
            this.view.showSuccessMessage();
        } catch (error) {
            this.view.showErrorMessage(
                error.message || 'Terjadi kesalahan saat mendaftar.',
            );
        }
    }
}
