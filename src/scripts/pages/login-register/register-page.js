import { AuthModel } from '../../data/auth-model.js';
import { RegisterPresenter } from '../../presenters/register-presenter.js';
import Swal from 'sweetalert2';

export class RegisterPage {
    constructor() {
        this.presenter = null;
    }

    render() {
        return `
      <section class="register-section container">
        <h1 class="register-section__title">Daftar Akun</h1>
        <form id="register-form" class="register-form">
          <div class="register-form__group">
            <label for="name" class="register-form__label">Nama</label>
            <input id="name" type="text" class="register-form__input" placeholder="Nama Lengkap" required />
          </div>
          <div class="register-form__group">
            <label for="email" class="register-form__label">Email</label>
            <input id="email" type="email" class="register-form__input" placeholder="Email" required />
          </div>
          <div class="register-form__group">
            <label for="password" class="register-form__label">Password</label>
            <input id="password" type="password" class="register-form__input" placeholder="Password (min. 8 karakter)" required />
          </div>
          <button type="submit" class="register-form__button">Buat Akun</button>
          <a href="#/login" class="login-form__button">Kembali</a>
        </form>
      </section>
    `;
    }

    async afterRender() {
        const model = new AuthModel();
        this.presenter = new RegisterPresenter(model, this);

        const form = document.getElementById('register-form');
        if (form) {
            form.addEventListener('submit', async (event) => {
                event.preventDefault();
                const name = document.getElementById('name')?.value;
                const email = document.getElementById('email')?.value;
                const password = document.getElementById('password')?.value;

                await this.presenter.registerUser(name, email, password);
            });
        } else {
            console.warn('Form register tidak ditemukan di DOM.');
        }
    }

    showLoading() {
        Swal.fire({
            title: 'Mendaftarkan...',
            didOpen: () => Swal.showLoading(),
            allowOutsideClick: false,
            allowEscapeKey: false,
            showConfirmButton: false,
        });
    }

    showSuccessMessage() {
        Swal.fire({
            icon: 'success',
            title: 'Pendaftaran berhasil!',
            text: 'Silakan login dengan akun Anda.',
            timer: 2000,
            showConfirmButton: false,
        }).then(() => {
            window.location.hash = '#/login';
        });
    }

    showErrorMessage(message) {
        Swal.fire({
            icon: 'error',
            title: 'Pendaftaran gagal!',
            text: message,
        });
    }
}
