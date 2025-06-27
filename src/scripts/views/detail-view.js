import { AvatarProfile } from '../components/avatar-profile.js';
import { showFormattedDate } from '../utils/index.js';

export class DetailView {
    showDetail(story) {
        document.getElementById('detail-name').textContent = story.name;

        const avatar = new AvatarProfile('detail-avatar', story.name);
        avatar.generate(48);

        document.getElementById('story-detail').innerHTML = `
            <img src="${story.photoUrl}" alt="Foto oleh ${story.name}" />
            <p><strong>Deskripsi:</strong> ${story.description}</p>
            <p><strong>Tanggal:</strong> ${showFormattedDate(
                story.createdAt,
            )}</p>
            ${
                story.lat && story.lon
                    ? `<p><strong>Lokasi:</strong> Lat ${story.lat}, Lon ${story.lon}</p>`
                    : '<p><em>Tidak ada data lokasi.</em></p>'
            }
        `;
    }

    hideMap() {
        document.getElementById('map').style.display = 'none';
    }

    async showMap(story) {
        const key = 'Z8CPHGSs8sjj4jpKnxkM';
        const L = await import('leaflet');
        const map = L.map('map').setView([story.lat, story.lon], 13);

        const tile = L.tileLayer(
            `https://tile.openstreetmap.org/{z}/{x}/{y}.png`,
            {
                attribution: '&copy; OpenStreetMap contributors',
            },
        );
        tile.addTo(map);

        fetch(
            `https://api.maptiler.com/geocoding/${story.lon},${story.lat}.json?key=${key}`,
        )
            .then((res) => res.json())
            .then((data) => {
                const placeName =
                    data?.features?.[0]?.place_name || 'Lokasi Cerita';
                L.marker([story.lat, story.lon])
                    .addTo(map)
                    .bindPopup(placeName)
                    .openPopup();
            })
            .catch(() => {
                L.marker([story.lat, story.lon])
                    .addTo(map)
                    .bindPopup('Lokasi Cerita')
                    .openPopup();
            });
    }

    showError(message) {
        document.getElementById(
            'story-detail',
        ).innerHTML = `<p style="color:red">${message}</p>`;
        this.hideMap();
    }
}
