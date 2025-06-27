import CONFIG from '../config.js';

export class AuthModel {
    async login(email, password) {
        const response = await fetch(`${CONFIG.BASE_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (!response.ok || result.error) {
            throw new Error(result.message || 'Gagal login');
        }

        const { token, name, userId } = result.loginResult;

        localStorage.setItem('token', token);
        localStorage.setItem('userName', name);
        localStorage.setItem('userId', userId);

        return result.loginResult;
    }

    async register(name, email, password) {
        const response = await fetch(`${CONFIG.BASE_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ name, email, password }),
        });

        const result = await response.json();

        if (!response.ok || result.error) {
            throw new Error(result.message || 'Gagal registrasi');
        }

        return result.message;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('userName');
        localStorage.removeItem('userId');
    }

    getToken() {
        return localStorage.getItem('token');
    }

    isLoggedIn() {
        return !!this.getToken();
    }
}
