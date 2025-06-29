import { openDB } from 'idb';

const DB_NAME = 'story-db';
const STORE_NAME = 'stories';

const dbPromise = openDB(DB_NAME, 1, {
    upgrade(db) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
    },
});

export const StoryDB = {
    async saveAll(stories) {
        const db = await dbPromise;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        for (const story of stories) {
            tx.store.put(story);
        }
        await tx.done;
    },

    async getAll() {
        const db = await dbPromise;
        return db.getAll(STORE_NAME);
    },

    async clear() {
        const db = await dbPromise;
        const tx = db.transaction(STORE_NAME, 'readwrite');
        await tx.store.clear();
        await tx.done;
    },
};
