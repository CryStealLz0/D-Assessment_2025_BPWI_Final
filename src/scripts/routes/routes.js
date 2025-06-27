import { HomePage } from '../pages/home/home-page.js';
import AboutPage from '../pages/about/about-page';
import { LoginPage } from '../pages/login-register/login-page';
import { RegisterPage } from '../pages/login-register/register-page';
import { FormPage } from '../pages/form/form-page.js';
import { DetailPage } from '../pages/detail/detail-page.js';

const isLoggedIn = () => !!localStorage.getItem('token');
if (window.location.hash === '#/' && !isLoggedIn()) {
    window.location.hash = '#/login';
}

if (window.location.hash === '#/logout') {
    localStorage.clear();
    location.hash = '#/login';
}

const routes = {
    '/': new HomePage(),
    '/register': new RegisterPage(),
    '/login': new LoginPage(),
    '/about': new AboutPage(),
    '/tambah': new FormPage(),
    '/detail/:id': new DetailPage(),
};

export default routes;
