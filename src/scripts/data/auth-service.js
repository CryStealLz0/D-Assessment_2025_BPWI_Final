export class AuthService {
    static TOKEN_KEY = 'token';

    static saveToken(token) {
        localStorage.setItem(this.TOKEN_KEY, token);
    }

    static getToken() {
        return localStorage.getItem(this.TOKEN_KEY);
    }

    static isLoggedIn() {
        return !!this.getToken();
    }

    static logout() {
        localStorage.removeItem(this.TOKEN_KEY);
    }
}
