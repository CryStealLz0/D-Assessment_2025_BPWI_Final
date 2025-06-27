import { AuthModel } from '../../data/auth-model.js';
import { LoginPresenter } from '../../presenters/login-presenter.js';
import Swal from 'sweetalert2';

export class LoginPage {
    constructor() {
        this.presenter = null;
    }

    render() {
        return `
      <section class="login-section container">
        <h1 class="login-section__title">Masuk ke Aplikasi</h1>
        <form id="login-form" class="login-form">
          <div class="login-form__group">
            <label for="email" class="login-form__label">Email</label>
            <input id="email" type="email" class="login-form__input" placeholder="Email" required />
          </div>
          <div class="login-form__group">
            <label for="password" class="login-form__label">Password</label>
            <input id="password" type="password" class="login-form__input" placeholder="Password" required />
          </div>
          <button type="submit" class="login-form__button">Login</button>
          <p class="login-form__register-text">
            Belum punya akun?
            <a href="#/register" class="login-form__link">Daftar di sini</a>
          </p>
        </form>
      </section>
    `;
    }

    async afterRender() {
        const model = new AuthModel();
        this.presenter = new LoginPresenter(model, this);

        const loginForm = document.getElementById('login-form');
        loginForm.addEventListener('submit', async (event) => {
            event.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            await this.presenter.loginUser(email, password);
        });
    }

    showLoading() {
        Swal.fire({
            title: 'Mohon tunggu...',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
        });
    }

    showSuccessMessage(userName) {
        Swal.fire({
            icon: 'success',
            title: `Halo, ${userName}!`,
            text: 'Login berhasil.',
            timer: 1500,
            showConfirmButton: false,
        }).then(() => {
            window.location.hash = '#/';
        });
    }

    showErrorMessage(message) {
        Swal.fire({
            icon: 'error',
            title: 'Login gagal!',
            text: message,
        });
    }
}
