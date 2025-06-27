import { getToken } from '../utils/auth.js';
import { DetailView } from '../views/detail-view.js';

export class DetailPresenter {
    constructor() {
        this.view = new DetailView();
    }

    async init() {
        const id = window.location.hash.split('/')[2];
        const token = getToken();

        try {
            const response = await fetch(
                `https://story-api.dicoding.dev/v1/stories/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                },
            );

            const result = await response.json();
            if (!response.ok || result.error) throw new Error(result.message);

            const story = result.story;
            this.view.showDetail(story);

            if (story.lat && story.lon) {
                this.view.showMap(story);
            } else {
                this.view.hideMap();
            }
        } catch (err) {
            this.view.showError(err.message);
        }
    }
}
