import { getToken } from '../utils/auth.js';
import { StoryModel } from '../models/story-model.js';
import CONFIG from '../config.js';

export class StoryRepository {
    async getStoriesWithLocation() {
        const token = getToken();
        if (!token) {
            location.hash = '#/login';
            return Promise.reject(new Error('Tidak ada token'));
        }

        const response = await fetch(`${CONFIG.BASE_URL}/stories?location=1`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });

        const result = await response.json();
        if (!response.ok || result.error) {
            throw new Error(result.message || 'Gagal mengambil data');
        }

        return result.listStory.map(StoryModel.fromJson);
    }

    async submitStory({ description, photo, lat, lon }) {
        const token = getToken();
        if (!token) throw new Error('Token tidak ditemukan');

        const formData = new FormData();
        formData.append('description', description);
        formData.append('photo', photo);
        formData.append('lat', lat);
        formData.append('lon', lon);

        const response = await fetch(`${CONFIG.BASE_URL}/stories`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
            },
            body: formData,
        });

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    }
}
