import { getToken } from '../utils/auth';
import CONFIG from '../config.js';

export class NotificationRepository {
    async subscribe(payload) {
        const response = await fetch(
            `${CONFIG.NOTIF_BASE_URL}${CONFIG.SUBSCRIBE}`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            },
        );

        const result = await this._parseResponse(response);
        return result;
    }

    async unsubscribe(endpoint) {
        const response = await fetch(
            `${CONFIG.NOTIF_BASE_URL}${CONFIG.SUBSCRIBE}`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ endpoint }),
            },
        );

        const result = await this._parseResponse(response);
        return result;
    }

    async _parseResponse(response) {
        let result;
        try {
            result = await response.json();
        } catch (e) {
            throw new Error('Gagal memproses respon server.');
        }
        if (!response.ok)
            throw new Error(result?.message || 'Terjadi kesalahan server.');
        return result;
    }
}
