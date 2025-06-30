import {
    openDatabase,
    putItem,
    getItem,
    getAllItems,
    removeItem,
    STORE_NAMES,
} from './utils/indexeddb-helper';

/** STORIES (OFFLINE CACHE) **/
export async function saveStory(story) {
    const db = await openDatabase();
    return putItem(db, STORE_NAMES.STORIES, story);
}

export async function saveStories(stories) {
    const db = await openDatabase();
    for (const story of stories) {
        await putItem(db, STORE_NAMES.STORIES, story);
    }
}

export async function getStory(id) {
    const db = await openDatabase();
    return getItem(db, STORE_NAMES.STORIES, id);
}

export async function getAllStories() {
    const db = await openDatabase();
    return getAllItems(db, STORE_NAMES.STORIES);
}

/** BOOKMARKS **/
export async function saveBookmark(story) {
    const db = await openDatabase();
    return putItem(db, STORE_NAMES.BOOKMARKS, story);
}

export async function getBookmark(id) {
    const db = await openDatabase();
    return getItem(db, STORE_NAMES.BOOKMARKS, id);
}

export async function getAllBookmarks() {
    const db = await openDatabase();
    return getAllItems(db, STORE_NAMES.BOOKMARKS);
}

export async function deleteBookmark(id) {
    const db = await openDatabase();
    return removeItem(db, STORE_NAMES.BOOKMARKS, id);
}
