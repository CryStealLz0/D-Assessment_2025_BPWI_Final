import { HomePage } from '../pages/home/home-page.js';
import AboutPage from '../pages/about/about-page.js';
import { LoginPage } from '../pages/login-register/login-page.js';
import { RegisterPage } from '../pages/login-register/register-page.js';
import { FormPage } from '../pages/form/form-page.js';
import { DetailPage } from '../pages/detail/detail-page.js';
import BookmarkPage from '../pages/bookmarked/bookmarked-page.js';

const isLoggedIn = () => !!localStorage.getItem('token');

if (window.location.hash === '#/' && !isLoggedIn()) {
  window.location.hash = '#/login';
}

if (window.location.hash === '#/logout') {
  localStorage.clear();
  window.location.hash = '#/login';
}

const routes = {
  '/': () => new HomePage(),
  '/register': () => new RegisterPage(),
  '/login': () => new LoginPage(),
  '/about': () => new AboutPage(),
  '/tambah': () => new FormPage(),
  '/detail/:id': () => new DetailPage(),
  '/bookmark': () => new BookmarkPage(),
  '/404': () => ({
    render: () =>
      Promise.resolve(`<section><h2>Halaman tidak ditemukan</h2></section>`),
    afterRender: () => Promise.resolve(),
  }),
};

export default routes;
