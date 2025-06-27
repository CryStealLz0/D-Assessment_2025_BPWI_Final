import { getToken } from '../utils/auth';
import CONFIG from '../config.js';

export class NotificationRepository {
    async subscribe(payload) {
        const response = await fetch(
            `${CONFIG.BASE_URL}/notifications/subscribe`,
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            },
        );

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    }

    async unsubscribe(endpoint) {
        const response = await fetch(
            `${CONFIG.BASE_URL}/notifications/subscribe`,
            {
                method: 'DELETE',
                headers: {
                    Authorization: `Bearer ${getToken()}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ endpoint }),
            },
        );

        const result = await response.json();
        if (!response.ok) throw new Error(result.message);
        return result;
    }
}
