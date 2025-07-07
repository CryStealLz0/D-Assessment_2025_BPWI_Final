import {
    openDatabase,
    putItem,
    getItem,
    removeItem,
    clearStore,
    STORE_NAMES,
} from './indexeddb-helper.js';

/**
 * Simpan hasil geocode dari MapTiler ke IndexedDB
 * @param {string} coords
 * @param {object} data
 */
export async function saveGeocodeResult(coords, data) {
    const db = await openDatabase();
    return putItem(db, STORE_NAMES.GEOCODE, {
        id: coords,
        data,
    });
}

/**
 * Ambil hasil geocode dari cache IndexedDB (jika ada)
 * @param {string} coords
 * @returns {object|null}
 */
export async function getGeocodeResult(coords) {
    const db = await openDatabase();
    const result = await getItem(db, STORE_NAMES.GEOCODE, coords);
    return result?.data || null;
}

/**
 * Fungsi utama untuk mendapatkan nama lokasi (offline-first)
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<string>}
 */
export async function getLocationName(lat, lon) {
    const coords = `${lat},${lon}`;
    const cached = await getGeocodeResult(coords);
    if (cached) {
        return cached?.features?.[0]?.place_name || '(Tidak diketahui)';
    }

    try {
        const res = await fetch(
            `https://api.maptiler.com/geocoding/${lon},${lat}.json?key=${
                import.meta.env.VITE_MAPTILER_KEY || 'Z8CPHGSs8sjj4jpKnxkM'
            }`,
        );
        if (!res.ok) throw new Error('Geocode fetch failed');
        const data = await res.json();
        await saveGeocodeResult(coords, data);
        return data?.features?.[0]?.place_name || '(Tidak diketahui)';
    } catch (err) {
        console.warn('Geocode offline fallback:', err);
        return '(Lokasi tidak tersedia)';
    }
}

/**
 * Fungsi opsional: hapus data cache lokasi tertentu
 * @param {string} coords
 */
export async function deleteGeocode(coords) {
    const db = await openDatabase();
    return removeItem(db, STORE_NAMES.GEOCODE, coords);
}

export async function clearGeocodeCache() {
    const db = await openDatabase();
    return clearStore(db, STORE_NAMES.GEOCODE);
}
