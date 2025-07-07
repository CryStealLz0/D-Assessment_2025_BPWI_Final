import { StoryRepository } from '../../data/story-repository.js';
import { HomePresenter } from '../../presenters/home-presenter.js';
import { requireAuth } from '../../middleware/auth-middleware.js';
import { showFormattedDate } from '../../utils/index.js';
import { AvatarProfile } from '../../components/avatar-profile.js';
import { getLocationName } from '../../utils/geocode-helper.js';
import '../templates/my-profile.js';
import L from 'leaflet';
import { applyDefaultLeafletIcon } from '../../utils/leaflet-icon-override.js';

applyDefaultLeafletIcon();

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

    async renderStories(stories) {
        const container = document.querySelector('.home__story-list');
        container.innerHTML = '';

        for (let index = 0; index < stories.length; index++) {
            const story = stories[index];
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
              <img id="story-photo-${index}" class="story-card__image" loading="lazy" alt="Foto oleh ${
                story.name
            }" />
              <p class="story-card__description">${story.description}</p>
              <p id="${locationId}" class="story-card__location">📍 Memuat lokasi...</p>
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

            const photoElem = document.getElementById(`story-photo-${index}`);
            photoElem.src = await this.#getCachedImageOrFallback(
                story.photoUrl,
            );
            photoElem.alt = `Foto cerita oleh ${story.name}`;

            const locationElem = document.getElementById(locationId);
            if (story.lat && story.lon && locationElem) {
                try {
                    const placeName = await getLocationName(
                        story.lat,
                        story.lon,
                    );
                    locationElem.textContent = `${placeName}`;
                } catch {
                    locationElem.textContent = 'Lokasi tidak tersedia';
                }
            } else {
                if (locationElem)
                    locationElem.textContent = 'Lokasi tidak tersedia';
            }
        }

        this.#initMap(stories);
    }

    renderError(message) {
        const container = document.querySelector('.home__story-list');
        if (container)
            container.innerHTML = `<p style="color:red">${message}</p>`;
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

    #initMap(stories) {
        const mapContainer = document.getElementById('map');
        if (!mapContainer) return;

        if (this._map) this._map.remove();
        this._map = L.map(mapContainer).setView([-2.5, 118], 4);

        const key = 'Z8CPHGSs8sjj4jpKnxkM';
        const openStreetMap = L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; OpenStreetMap contributors',
            },
        );
        openStreetMap.addTo(this._map);

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

        L.control
            .layers({
                OpenStreetMap: openStreetMap,
                'Dark (MapTiler)': mapTilerDark,
                'Streets (MapTiler)': mapTilerStreets,
            })
            .addTo(this._map);

        stories.forEach((story) => {
            if (story.lat && story.lon) {
                getLocationName(story.lat, story.lon)
                    .then((placeName) => {
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
