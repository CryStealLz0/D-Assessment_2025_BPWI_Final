import { DetailPresenter } from '../../presenters/detail-presenter.js';

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
          <a href="#/" class="detail__back-link">Kembali ke Beranda</a>
        </section>
      `;
    }

    async afterRender() {
        const presenter = new DetailPresenter();
        await presenter.init();
    }
}
