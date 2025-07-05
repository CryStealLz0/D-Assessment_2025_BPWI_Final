import { StoryRepository } from '../../data/story-repository.js';
import { HomePresenter } from '../../presenters/home-presenter.js';
import { requireAuth } from '../../middleware/auth-middleware.js';
import { showFormattedDate } from '../../utils/index.js';
import { AvatarProfile } from '../../components/avatar-profile.js';
import '../templates/my-profile.js';
import L from 'leaflet';

export class HomePage {
    constructor() {
        this.presenter = null;
        this._map = null;
    }

    render() {
        return `
      <section class="home">
        <h1 class="home__title">Beranda</h1>

        <section>
          <my-profile></my-profile>
        </section>

        <section>
          <h2 class="home__title__sub">Peta Lokasi Cerita</h2>
          <div id="map" class="home__map" role="region" aria-label="Peta Cerita"></div>
        </section>

        <section>
          <h2 class="home__title__sub">Daftar Cerita</h2>
          <div class="home__story-list">Memuat cerita...</div>
        </section>
      </section>
    `;
    }

    async afterRender() {
        try {
            requireAuth();
        } catch {
            return;
        }

        this.presenter = new HomePresenter(new StoryRepository(), this);
        await this.presenter.loadStories();
    }

    showLoading() {
        const container = document.querySelector('.home__story-list');
        if (container) container.innerHTML = 'Memuat cerita...';
    }

    renderStories(stories) {
        const container = document.querySelector('.home__story-list');
        container.innerHTML = '';

        stories.forEach((story, index) => {
            const item = document.createElement('article');
            item.className = 'story-card';
            item.setAttribute('role', 'article');

            const avatarId = `story-avatar-${index}`;
            const locationId = `story-location-${index}`;

            item.innerHTML = `
              <div class="story-card__header">
                <div id="${avatarId}" class="story-card__avatar"></div>
                <h3 class="story-card__name">${story.name}</h3>
              </div>
              <img src="${story.photoUrl}" alt="Cerita oleh ${
                story.name
            }" class="story-card__image" loading="lazy" />
              <p class="story-card__description">${story.description}</p>
              <p id="${locationId}" class="story-card__location">Memuat lokasi...</p>
              <small class="story-card__date"><strong>Tanggal:</strong> ${showFormattedDate(
                  story.createdAt,
                  'id-ID',
              )}</small>
              <a href="#/detail/${
                  story.id
              }" class="story-card__link">Lihat Detail</a>
            `;

            container.appendChild(item);

            const avatar = new AvatarProfile(avatarId, story.name);
            avatar.generate(40);

            const locationElem = document.getElementById(locationId);
            const key = 'Z8CPHGSs8sjj4jpKnxkM';

            if (story.lat && story.lon) {
                fetch(
                    `https://api.maptiler.com/geocoding/${story.lon},${story.lat}.json?key=${key}`,
                )
                    .then((res) => res.json())
                    .then((data) => {
                        const placeName =
                            data?.features?.[0]?.place_name ||
                            'Lokasi tersedia';
                        if (locationElem) locationElem.textContent = placeName;
                    })
                    .catch(() => {
                        if (locationElem)
                            locationElem.textContent = 'Lokasi tersedia';
                    });
            } else {
                if (locationElem)
                    locationElem.textContent = 'Lokasi tidak tersedia';
            }
        });

        this.#initMap(stories);
    }

    renderError(message) {
        const container = document.querySelector('.home__story-list');
        if (container)
            container.innerHTML = `<p style="color:red">${message}</p>`;
    }

    #initMap(stories) {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) {
            console.warn('Map container tidak ditemukan.');
            return;
        }

        if (this._map) {
            this._map.remove();
        }

        this._map = L.map(mapContainer).setView([-2.5, 118], 4);
        const key = 'Z8CPHGSs8sjj4jpKnxkM';

        const openStreetMap = L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; OpenStreetMap contributors',
            },
        );

        const mapTilerDark = L.tileLayer(
            `https://api.maptiler.com/maps/toner-dark/{z}/{x}/{y}.png?key=${key}`,
            {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '&copy; MapTiler',
            },
        );

        const mapTilerStreets = L.tileLayer(
            `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,
            {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '&copy; MapTiler',
            },
        );

        openStreetMap.addTo(this._map);

        const baseLayers = {
            OpenStreetMap: openStreetMap,
            'Dark (MapTiler)': mapTilerDark,
            'Streets (MapTiler)': mapTilerStreets,
        };
        L.control.layers(baseLayers).addTo(this._map);

        stories.forEach((story) => {
            if (story.lat && story.lon) {
                fetch(
                    `https://api.maptiler.com/geocoding/${story.lon},${story.lat}.json?key=${key}`,
                )
                    .then((res) => res.json())
                    .then((data) => {
                        const placeName =
                            data?.features?.[0]?.place_name ||
                            'Lokasi tidak diketahui';
                        const marker = L.marker([story.lat, story.lon]).addTo(
                            this._map,
                        );
                        marker.bindPopup(
                            `<b>${story.name}</b><br>${story.description}<br><i>${placeName}</i>`,
                        );
                    })
                    .catch(() => {
                        const marker = L.marker([story.lat, story.lon]).addTo(
                            this._map,
                        );
                        marker.bindPopup(
                            `<b>${story.name}</b><br>${story.description}`,
                        );
                    });
            }
        });
    }
}
