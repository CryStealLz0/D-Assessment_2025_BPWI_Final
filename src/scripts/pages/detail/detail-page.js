import { DetailPresenter } from '../../presenters/detail-presenter.js';
import { saveBookmark } from '../../db.js';
import { getLocationName } from '../../utils/geocode-helper.js';
import { AvatarProfile } from '../../components/avatar-profile.js';

export class DetailPage {
    render() {
        return `
        <section class="detail">
          <h1 class="detail__title">Detail Story Map Kita</h1>
          <div class="detail__user">
            <div id="detail-avatar" class="detail__avatar"></div>
            <h2 id="detail-name" class="detail__name">Nama</h2>
          </div>
          <img id="detail-photo" class="detail__image" alt="Foto cerita" loading="lazy" />
          <div id="story-detail" class="detail__content">Memuat detail cerita...</div>

          <p id="story-location" class="detail__location">Memuat lokasi...</p>
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

        if (!story) return;

        const nameElem = document.getElementById('detail-name');
        if (nameElem) nameElem.textContent = story.name || 'Tidak diketahui';

        const detailElem = document.getElementById('story-detail');
        if (detailElem) {
            detailElem.textContent =
                story.description || '(Tidak ada deskripsi)';
        }

        const avatarContainer = document.getElementById('detail-avatar');
        if (avatarContainer && story.name) {
            const avatar = new AvatarProfile('detail-avatar', story.name);
            avatar.generate(48);
        }

        const photoElem = document.getElementById('detail-photo');
        if (photoElem && story.photoUrl) {
            photoElem.src = await this.#getCachedImageOrFallback(
                story.photoUrl,
            );
            photoElem.alt = `Foto cerita oleh ${story.name}`;
        }

        const locationText = document.querySelector('#story-location');
        const lat = Number(story?.lat);
        const lon = Number(story?.lon);
        if (!isNaN(lat) && !isNaN(lon) && locationText) {
            locationText.textContent = 'Memuat lokasi...';
            try {
                const locationName = await getLocationName(lat, lon);
                locationText.textContent = `${locationName}`;
            } catch (err) {
                console.warn('❌ Gagal memuat lokasi:', err);
                locationText.textContent = 'Lokasi tidak tersedia';
            }
        }

        const bookmarkBtn = document.querySelector('#bookmark-btn');
        if (bookmarkBtn) {
            bookmarkBtn.addEventListener('click', async () => {
                try {
                    await saveBookmark(story);
                    alert('Cerita berhasil disimpan ke Bookmark!');
                } catch (err) {
                    console.error('❌ Gagal menyimpan bookmark:', err);
                    alert('Gagal menyimpan ke Bookmark.');
                }
            });
        }
    }

    async #getCachedImageOrFallback(url, fallback = '/images/placeholder.png') {
        try {
            const cache = await caches.open('story-images');
            const cachedResponse = await cache.match(url);
            if (cachedResponse) {
                const blob = await cachedResponse.blob();
                return URL.createObjectURL(blob);
            }
            return url;
        } catch {
            return fallback;
        }
    }
}
