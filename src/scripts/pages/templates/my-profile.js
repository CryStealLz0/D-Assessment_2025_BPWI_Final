import { AvatarProfile } from '../../components/avatar-profile';

class MyProfile extends HTMLElement {
    connectedCallback() {
        this.render();
    }

    render() {
        const name = localStorage.getItem('userName') || 'Guest';
        this.innerHTML = `
      <section class="home__profile">
        <div id="avatar-container" class="profile__avatar"></div>
        <div class="profile__container">
          <h2 id="user-name" class="profile__name"></h2>
          <button class="profile__button btn-style" id="add-story-btn">Tambahkan Cerita Baru</button>
        </div>
      </section>
    `;

        const avatar = new AvatarProfile('avatar-container', name);
        avatar.generate();

        this.querySelector('#user-name').textContent = name;

        this.querySelector('#add-story-btn').addEventListener('click', () => {
            window.location.hash = '#/tambah';
        });
    }
}

customElements.define('my-profile', MyProfile);
