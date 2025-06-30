import { DetailPresenter } from '../../presenters/detail-presenter.js';
import { saveBookmark } from '../../db.js';

export class DetailPage {
    render() {
        return `
        <section class="detail">
          <h1 class="detail__title">Detail Story Map Kita</h1>
          <div class="detail__user">
            <div id="detail-avatar" class="detail__avatar"></div>
            <h2 id="detail-name" class="detail__name">Nama</h2>
          </div>
          <div id="story-detail" class="detail__content">Memuat detail cerita...</div>
          <div id="map" class="detail__map"></div>
          <div class="detail__buttons">
            <button id="bookmark-btn" class="detail__back-link">Simpan ke Bookmark</button>
            <a href="#/" class="detail__back-link">Kembali ke Beranda</a>
          </div>
        </section>
      `;
    }

    async afterRender() {
        const presenter = new DetailPresenter();
        const story = await presenter.init();

        const bookmarkBtn = document.querySelector('#bookmark-btn');
        if (bookmarkBtn && story) {
            bookmarkBtn.addEventListener('click', async () => {
                try {
                    await saveBookmark(story);
                    alert('Cerita berhasil disimpan ke Bookmark!');
                } catch (err) {
                    console.error('Gagal menyimpan bookmark:', err);
                    alert('Gagal menyimpan ke Bookmark.');
                }
            });
        }
    }
}
