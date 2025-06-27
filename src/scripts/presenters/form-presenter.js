export class FormPresenter {
    constructor(repository, view) {
        this.repository = repository;
        this.view = view;
    }

    async submitStory(description, photo, latlng) {
        try {
            this.view.showLoading();
            await this.repository.submitStory({
                description,
                photo,
                lat: latlng.lat,
                lon: latlng.lng,
            });
            this.view.showSuccess();
        } catch (error) {
            this.view.showError(error.message);
        }
    }
}
