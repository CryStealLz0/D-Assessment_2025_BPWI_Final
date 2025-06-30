import { getAllBookmarks, deleteBookmark } from '../data/db.js';
import Swal from 'sweetalert2';

export class BookmarkPresenter {
    #view;

    constructor(view) {
        this.#view = view;
    }

    async loadBookmarks() {
        this.#view.showLoading();

        try {
            const stories = await getAllBookmarks();

            if (!stories || stories.length === 0) {
                this.#view.showEmptyMessage('Belum ada cerita yang disimpan.');
            } else {
                this.#view.showBookmarks(stories);
                this.#bindRemoveEvents();
            }
        } catch (error) {
            console.error('BookmarkPresenter error:', error);
            this.#view.showError('Gagal memuat data bookmark.');
        } finally {
            this.#view.hideLoading();
        }
    }

    #bindRemoveEvents() {
        const buttons = document.querySelectorAll('.remove-btn');
        buttons.forEach((btn) => {
            btn.addEventListener('click', async () => {
                const storyId = btn.dataset.id;

                const confirm = await Swal.fire({
                    title: 'Hapus Bookmark?',
                    text: 'Data ini akan dihapus dari bookmark.',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Ya, hapus',
                });

                if (confirm.isConfirmed) {
                    await deleteBookmark(storyId);
                    await this.loadBookmarks();
                    Swal.fire(
                        'Berhasil',
                        'Cerita dihapus dari bookmark.',
                        'success',
                    );
                }
            });
        });
    }
}
