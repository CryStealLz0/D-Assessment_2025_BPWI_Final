import { saveStories, getAllStories } from '../db.js';

export class HomePresenter {
  constructor(repository, view) {
    this.repository = repository;
    this.view = view;
  }

  async loadStories() {
    this.view.showLoading();

    try {
      const stories = await this.repository.getStoriesWithLocation();

      await saveStories(stories);

      this.view.renderStories(stories);
    } catch (error) {
      console.warn('Gagal fetch dari API, mencoba dari IndexedDB...');

      try {
        const offlineStories = await getAllStories();

        if (offlineStories.length > 0) {
          this.view.renderStories(offlineStories);
          return;
        }

        throw new Error('Tidak ada data offline tersimpan.');
      } catch (fallbackError) {
        console.error('Presenter Error:', fallbackError.message);
        this.view.renderError(fallbackError.message || 'Gagal memuat cerita');
      }
    }
  }
}
