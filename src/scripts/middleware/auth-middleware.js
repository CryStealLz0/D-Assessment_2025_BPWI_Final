import { AuthService } from '../data/auth-service.js';

export function requireAuth() {
    if (!AuthService.isLoggedIn()) {
        window.location.hash = '#/login';
        throw new Error('Unauthorized');
    }
}
