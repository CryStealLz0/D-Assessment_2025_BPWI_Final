export function getToken() {
    return localStorage.getItem('token');
}

export function requireAuth() {
    if (!getToken()) {
        window.location.hash = '#/login';
        throw new Error('Unauthenticated');
    }
}

export function isLoggedIn() {
    return !!getToken();
}

export function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    localStorage.removeItem('userName');
}
