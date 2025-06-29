import { getToken } from '../utils/auth.js';
import { DetailView } from '../views/detail-view.js';
import { saveStoryDetail, getStoryDetail } from '../db.js';
import CONFIG from '../config.js';

export class DetailPresenter {
    constructor() {
        this.view = new DetailView();
    }

    async init() {
        const id = window.location.hash.split('/')[2];
        const token = getToken();

        try {
            const response = await fetch(`${CONFIG.BASE_URL}/stories/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            const result = await response.json();
            if (!response.ok || result.error) throw new Error(result.message);

            const story = result.story;
            this.view.showDetail(story);
            await saveStoryDetail(story);

            if (story.lat && story.lon) {
                this.view.showMap(story);
            } else {
                this.view.hideMap();
            }
        } catch (err) {
            console.warn(
                'Fetching detail failed, trying cache...',
                err.message,
            );

            const cachedStory = await getStoryDetail(id);
            if (cachedStory) {
                this.view.showDetail(cachedStory);
                if (cachedStory.lat && cachedStory.lon) {
                    this.view.showMap(cachedStory);
                } else {
                    this.view.hideMap();
                }
            } else {
                this.view.showError('Gagal memuat detail dan tidak ada cache.');
            }
        }
    }
}
