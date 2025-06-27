import { AuthService } from '../data/auth-service.js';

export class LoginPresenter {
    constructor(model, view) {
        this.model = model;
        this.view = view;
    }

    async loginUser(email, password) {
        try {
            this.view.showLoading();
            const user = await this.model.login(email, password);

            AuthService.saveToken(user.token);

            this.view.showSuccessMessage(user.name);
        } catch (error) {
            this.view.showErrorMessage(error.message);
        }
    }
}
