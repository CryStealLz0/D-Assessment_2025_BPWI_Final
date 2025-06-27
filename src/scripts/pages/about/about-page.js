import Swal from 'sweetalert2';
import 'leaflet/dist/leaflet.css';
import { requireAuth } from '../../middleware/auth-guard';
import { LoginPage } from '../login-register/login-page';

export default class AboutPage {
    async render() {
        try {
            requireAuth();
        } catch {
            return '';
        }
        return `
      <section class="about">
        <h1 class="about__title">Tentang Story Map Kita</h1>
        <p class="about__description">
          Aplikasi ini merupakan platform berbasis web yang memungkinkan pengguna untuk:
        </p>
        <ul class="about__list">
          <li class="about__item">Membagikan cerita beserta lokasi secara interaktif menggunakan peta digital.</li>
          <li class="about__item">Mengunggah foto melalui kamera atau galeri perangkat.</li>
          <li class="about__item">Menelusuri daftar cerita pengguna lain dengan visualisasi lokasi melalui marker pada peta.</li>
          <li class="about__item">Menerima notifikasi real-time saat cerita baru ditambahkan.</li>
        </ul>
        <p class="about__description">
          Dengan tampilan yang sederhana namun interaktif, aplikasi ini dirancang untuk memberikan
          pengalaman pengguna yang responsif, aman, dan menyenangkan.
        </p>
        <h2 class="about__subtitle">Fitur Unggulan:</h2>
        <div class="about__features">
          <div class="about__feature-card">
            <h3 class="about__feature-title">Lokasi Interaktif</h3>
            <p class="about__feature-desc">Setiap cerita dikaitkan dengan koordinat peta yang akurat.</p>
          </div>
          <div class="about__feature-card">
            <h3 class="about__feature-title">Kamera Langsung</h3>
            <p class="about__feature-desc">Ambil gambar langsung dari kamera atau pilih dari galeri.</p>
          </div>
          <div class="about__feature-card">
            <h3 class="about__feature-title">Notifikasi Web</h3>
            <p class="about__feature-desc">Dapatkan pemberitahuan otomatis setiap ada cerita baru.</p>
          </div>
          <div class="about__feature-card">
            <h3 class="about__feature-title">SPA & MVP</h3>
            <p class="about__feature-desc">Menggunakan arsitektur Single Page Application dan pola Model-View-Presenter.</p>
          </div>
        </div>
        <p class="about__footer">
          Dibuat sebagai bagian dari Tugas proyek submission Dicoding.
        </p>
      </section>
    `;
    }

    async afterRender() {}
}
