import { getAllBookmarks, deleteBookmark } from '../../db.js';
import Swal from 'sweetalert2';

export default class BookmarkPage {
    render() {
        return `
      <section class="bookmark">
        <div class="bookmark__header">
          <h2 class="bookmark__title">Bookmark Saya</h2>
        </div>
        <div id="bookmark-list" class="bookmark__list"></div>
      </section>
    `;
    }

    async afterRender() {
        const listEl = document.getElementById('bookmark-list');
        listEl.innerHTML = '';

        try {
            const stories = await getAllBookmarks();

            if (!stories.length) {
                listEl.innerHTML = `<p class="bookmark__empty">Belum ada cerita yang disimpan.</p>`;
                return;
            }

            stories.forEach((story) => {
                const card = document.createElement('article');
                card.className = 'bookmark__card';

                card.innerHTML = `
          ${
              story.photo
                  ? `
            <figure class="bookmark__image-wrapper">
              <img src="${story.photo}" alt="${story.name}" class="bookmark__image" loading="lazy" />
              <figcaption class="bookmark__caption">${story.name}</figcaption>
            </figure>
          `
                  : ''
          }

          <div class="bookmark__content">
            <h3 class="bookmark__name">${story.name}</h3>
            <p class="bookmark__description">${story.description}</p>
          </div>

          <footer class="bookmark__actions">
            <a href="#/detail/${
                story.id
            }" class="bookmark__button bookmark__button--view">Lihat Detail</a>
            <button class="bookmark__button bookmark__button--delete" data-id="${
                story.id
            }">Hapus</button>
          </footer>
        `;

                listEl.appendChild(card);
            });

            this.#bindRemoveEvents();
        } catch (error) {
            listEl.innerHTML = `<p class="bookmark__error">${error.message}</p>`;
        }
    }

    #bindRemoveEvents() {
        const buttons = document.querySelectorAll('.bookmark__button--delete');
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
                    await this.afterRender();
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
