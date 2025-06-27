import L from 'leaflet';
import Swal from 'sweetalert2';
import 'leaflet/dist/leaflet.css';

import { StoryRepository } from '../../data/story-repository';
import { FormPresenter } from '../../presenters/form-presenter';
import { requireAuth } from '../../middleware/auth-guard';

export class FormPage {
    constructor() {
        this.selectedLatLng = null;
        this.presenter = null;
        this.capturedImage = null;
        this.cameraStream = null;
    }

    render() {
        return `
      <section class="form-story container">
        <h1 class="form-story__title">Tambah Cerita Baru</h1>
        <form id="story-form" class="form-story__form">
          <div class="form-story__group">
            <label for="description" class="form-story__label">Deskripsi</label>
            <textarea id="description" class="form-story__textarea" rows="3" required></textarea>
          </div>
          <div class="form-story__group">
            <label for="photo" class="form-story__label">Pilih Gambar dari File:</label>
            <input id="photo" class="form-story__input" type="file" accept="image/*" />
          </div>
          <div class="form-story__group">
            <span class="form-story__label">Atau ambil foto langsung:</span>
            <div class="form-story__buttons">
              <button type="button" id="camera-start" class="form-story__button">Aktifkan Kamera</button>
              <button type="button" id="camera-stop" class="form-story__button form-story__button--danger" style="display:none;">Matikan Kamera</button>
            </div>
            <video id="camera-video" class="form-story__video" autoplay style="display:none;"></video>
            <button type="button" id="camera-capture" class="form-story__button" style="display:none;">Ambil Foto</button>
            <canvas id="camera-canvas" style="display:none;"></canvas>
            <div id="photo-preview" class="form-story__preview"></div>
          </div>
          <div class="form-story__group">
            <span class="form-story__label">Klik lokasi pada peta:</span>
            <div id="map" class="form-story__map" aria-label="Peta untuk memilih lokasi cerita"></div>
          </div>
          <button type="submit" class="form-story__submit">Kirim Cerita</button>
        </form>
      </section>
    `;
    }

    async afterRender() {
        try {
            requireAuth();
        } catch {
            return;
        }

        this.presenter = new FormPresenter(new StoryRepository(), this);
        this.initMap();
        this.initPreviewHandler();
        this.initCameraHandlers();

        if (!this._cameraListenerAdded) {
            window.addEventListener('hashchange', () => this.stopCamera());
            this._cameraListenerAdded = true;
        }

        document
            .getElementById('story-form')
            .addEventListener('submit', async (e) => {
                e.preventDefault();

                const description =
                    document.getElementById('description').value;
                const fileInput = document.getElementById('photo');
                const fileFromInput = fileInput.files[0];

                if (fileFromInput && this.capturedImage) {
                    Swal.fire(
                        'Pilih hanya satu sumber gambar',
                        'Gunakan file ATAU kamera',
                        'warning',
                    );
                    return;
                }

                let photoFile;
                if (fileFromInput) {
                    photoFile = fileFromInput;
                } else if (this.capturedImage) {
                    const blob = await (await fetch(this.capturedImage)).blob();
                    photoFile = new File([blob], 'captured.png', {
                        type: 'image/png',
                    });
                } else {
                    Swal.fire('Pilih gambar terlebih dahulu', '', 'info');
                    return;
                }

                if (!this.selectedLatLng) {
                    Swal.fire('Pilih lokasi pada peta', '', 'info');
                    return;
                }

                await this.presenter.submitStory(
                    description,
                    photoFile,
                    this.selectedLatLng,
                );
            });
    }

    initPreviewHandler() {
        const photoInput = document.getElementById('photo');
        const previewContainer = document.getElementById('photo-preview');

        photoInput.addEventListener('change', (e) => {
            this.capturedImage = null;
            this.stopCamera();

            const file = e.target.files[0];
            if (!file) return;

            const img = document.createElement('img');
            img.src = URL.createObjectURL(file);
            img.style.maxWidth = '100%';
            img.style.borderRadius = '8px';

            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
        });
    }

    initCameraHandlers() {
        const video = document.getElementById('camera-video');
        const canvas = document.getElementById('camera-canvas');
        const captureBtn = document.getElementById('camera-capture');
        const stopBtn = document.getElementById('camera-stop');
        const previewContainer = document.getElementById('photo-preview');
        const startBtn = document.getElementById('camera-start');
        const fileInput = document.getElementById('photo');

        startBtn.addEventListener('click', async () => {
            try {
                fileInput.value = '';
                this.capturedImage = null;

                this.cameraStream = await navigator.mediaDevices.getUserMedia({
                    video: true,
                });
                video.srcObject = this.cameraStream;

                video.style.display = 'block';
                captureBtn.style.display = 'inline-block';
                stopBtn.style.display = 'inline-block';
                startBtn.style.display = 'none';
            } catch (err) {
                Swal.fire('Gagal mengakses kamera', err.message, 'error');
            }
        });

        captureBtn.addEventListener('click', () => {
            const context = canvas.getContext('2d');
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);
            this.capturedImage = canvas.toDataURL('image/png');

            const img = document.createElement('img');
            img.src = this.capturedImage;
            img.style.maxWidth = '100%';
            img.style.borderRadius = '8px';

            previewContainer.innerHTML = '';
            previewContainer.appendChild(img);
        });

        stopBtn.addEventListener('click', () => {
            this.stopCamera();
        });
    }

    stopCamera() {
        const video = document.getElementById('camera-video');
        const startBtn = document.getElementById('camera-start');
        const captureBtn = document.getElementById('camera-capture');
        const stopBtn = document.getElementById('camera-stop');

        if (this.cameraStream) {
            this.cameraStream.getTracks().forEach((track) => track.stop());
            this.cameraStream = null;
        }

        if (video) {
            video.srcObject = null;
            video.style.display = 'none';
        }

        if (captureBtn) captureBtn.style.display = 'none';
        if (stopBtn) stopBtn.style.display = 'none';
        if (startBtn) startBtn.style.display = 'inline-block';
    }

    showLoading() {
        Swal.fire({
            title: 'Mengirim cerita...',
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading(),
        });
    }

    showSuccess() {
        Swal.fire('Berhasil', 'Cerita berhasil ditambahkan!', 'success');
        window.location.hash = '#/';
    }

    showError(message) {
        Swal.fire('Gagal', message, 'error');
    }

    initMap() {
        const map = L.map('map').setView([-2.5, 118], 4);
        const key = 'Z8CPHGSs8sjj4jpKnxkM';

        const osm = L.tileLayer(
            'https://tile.openstreetmap.org/{z}/{x}/{y}.png',
            {
                attribution: '&copy; OpenStreetMap contributors',
            },
        );

        const maptilerBasic = L.tileLayer(
            `https://api.maptiler.com/maps/basic-v2/{z}/{x}/{y}.png?key=${key}`,
            {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '&copy; MapTiler & contributors',
            },
        );

        const maptilerStreets = L.tileLayer(
            `https://api.maptiler.com/maps/streets-v2/{z}/{x}/{y}.png?key=${key}`,
            {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '&copy; MapTiler & contributors',
            },
        );

        const maptilerSatellite = L.tileLayer(
            `https://api.maptiler.com/maps/hybrid/{z}/{x}/{y}.jpg?key=${key}`,
            {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '&copy; MapTiler & contributors',
            },
        );

        const maptilerTopo = L.tileLayer(
            `https://api.maptiler.com/maps/topo-v2/{z}/{x}/{y}.png?key=${key}`,
            {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '&copy; MapTiler & contributors',
            },
        );

        const maptilerDark = L.tileLayer(
            `https://api.maptiler.com/maps/dataviz-darkmatter/{z}/{x}/{y}.png?key=${key}`,
            {
                tileSize: 512,
                zoomOffset: -1,
                attribution: '&copy; MapTiler & contributors',
            },
        );

        osm.addTo(map);

        const baseLayers = {
            OpenStreetMap: osm,
            'MapTiler Basic': maptilerBasic,
            'MapTiler Streets': maptilerStreets,
            'MapTiler Satellite': maptilerSatellite,
            'MapTiler Topo': maptilerTopo,
            'MapTiler Dark': maptilerDark,
        };

        L.control.layers(baseLayers).addTo(map);

        let marker = null;

        map.on('click', (e) => {
            this.selectedLatLng = e.latlng;
            if (marker) map.removeLayer(marker);

            fetch(
                `https://api.maptiler.com/geocoding/${e.latlng.lng},${e.latlng.lat}.json?key=${key}`,
            )
                .then((res) => res.json())
                .then((data) => {
                    const placeName =
                        data?.features?.[0]?.place_name || 'Lokasi dipilih';
                    marker = L.marker(e.latlng).addTo(map);
                    marker.bindPopup(placeName).openPopup();
                })
                .catch(() => {
                    marker = L.marker(e.latlng).addTo(map);
                    marker.bindPopup('Lokasi dipilih').openPopup();
                });
        });
    }
}
