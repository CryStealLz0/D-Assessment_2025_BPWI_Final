import { getToken } from '../utils/auth.js';
import { DetailView } from '../views/detail-view.js';
import CONFIG from '../config.js';
import { getStory } from '../db.js';

export class DetailPresenter {
    constructor() {
        this.view = new DetailView();
    }

    async init() {
        const id = window.location.hash.split('/')[2];
        const token = getToken();

        try {
            const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const result = await response.json();
            if (!response.ok || result.error) throw new Error(result.message);

            const story = result.story;
            this.view.showDetail(story);

            if (story.lat && story.lon) this.view.showMap(story);
            else this.view.hideMap();

            return story;
        } catch (err) {
            console.warn(
                'Gagal fetch dari API, mencoba dari IndexedDB...',
                err.message,
            );
            try {
                const story = await getStory(id);
                if (!story)
                    throw new Error('Cerita tidak ditemukan secara offline.');

                this.view.showDetail(story);
                if (story.lat && story.lon) this.view.showMap(story);
                else this.view.hideMap();

                return story;
            } catch (fallbackErr) {
                this.view.showError(fallbackErr.message);
                return null;
            }
        }
    }
}
