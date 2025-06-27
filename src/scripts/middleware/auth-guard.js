import Swal from 'sweetalert2';
import { isLoggedIn } from '../utils/auth.js';

export function requireAuth() {
    if (!isLoggedIn()) {
        Swal.fire({
            icon: 'warning',
            title: 'Akses Ditolak',
            text: 'Silakan login terlebih dahulu.',
        }).then(() => {
            window.location.hash = '#/login';
        });
        throw new Error('Akses ditolak. Silakan login terlebih dahulu.');
    }
}

export function authGuard(allowedRoutes = []) {
    const token = localStorage.getItem('token');
    const currentRoute = location.hash;
    if (!token && allowedRoutes.includes(currentRoute)) {
        Swal.fire({
            icon: 'warning',
            title: 'Akses Ditolak',
            text: 'Silakan login terlebih dahulu.',
        }).then(() => {
            location.hash = '#/login';
        });
        return false;
    }
    return true;
}
