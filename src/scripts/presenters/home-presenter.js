import { StoryDB } from '../utils/idb.js'; // IndexedDB helper

export class HomePresenter {
    constructor(repository, view) {
        this.repository = repository;
        this.view = view;
    }

    async loadStories() {
        try {
            this.view.showLoading();

            const stories = await this.repository.getStoriesWithLocation();

            // Simpan ke IndexedDB
            for (const story of stories) {
                await StoryDB.save(story);
            }

            this.view.renderStories(stories);
        } catch (error) {
            // Ambil dari IndexedDB jika gagal fetch
            const cached = await StoryDB.getAll();

            if (cached.length > 0) {
                console.warn(
                    'Menampilkan data dari IndexedDB karena fetch gagal',
                );
                this.view.renderStories(cached);
            } else {
                if (
                    error.message?.includes('Unauthorized') ||
                    error.message?.includes('Token')
                ) {
                    localStorage.removeItem('token');
                    window.location.hash = '#/login';
                    return;
                }

                console.error('Presenter Error:', error.message);
                this.view.renderError(error.message || 'Gagal memuat cerita');
            }
        }
    }
}
