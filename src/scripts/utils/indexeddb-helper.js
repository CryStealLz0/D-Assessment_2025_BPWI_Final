const DB_NAME = 'StoryMapKitaDB';
const DB_VERSION = 3;

export const STORE_NAMES = {
    STORIES: 'stories',
    BOOKMARKS: 'bookmarks',
    GEOCODE: 'geocode',
};

export function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(DB_NAME, DB_VERSION);

        request.onupgradeneeded = (event) => {
            const db = event.target.result;

            if (!db.objectStoreNames.contains(STORE_NAMES.STORIES)) {
                db.createObjectStore(STORE_NAMES.STORIES, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(STORE_NAMES.BOOKMARKS)) {
                db.createObjectStore(STORE_NAMES.BOOKMARKS, { keyPath: 'id' });
            }

            if (!db.objectStoreNames.contains(STORE_NAMES.GEOCODE)) {
                db.createObjectStore(STORE_NAMES.GEOCODE, { keyPath: 'id' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function putItem(db, storeName, item) {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put(item);
    return tx.complete;
}

export function getItem(db, storeName, id) {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return new Promise((resolve, reject) => {
        const request = store.get(id);
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function getAllItems(db, storeName) {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    return new Promise((resolve, reject) => {
        const request = store.getAll();
        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

export function removeItem(db, storeName, id) {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).delete(id);
    return tx.complete;
}

export function clearStore(db, storeName) {
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).clear();
    return tx.complete;
}
