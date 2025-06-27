export function renderFooterDropUp() {
    const footer = document.getElementById('footer');
    if (!footer) return;

    footer.classList.add('footer', 'footer--hidden');

    footer.innerHTML = `
    <div class="footer__container">
      <p class="footer__text">
        © ${new Date().getFullYear()} StoryMapKita. All rights reserved. <br />
        Built with by Dimas Indra Jaya.
      </p>
    </div>
  `;

    const toggleBtn = document.createElement('button');
    toggleBtn.id = 'footerToggleBtn';
    toggleBtn.className = 'footer-toggle';
    toggleBtn.textContent = 'Lihat Footer';

    document.body.appendChild(toggleBtn);

    toggleBtn.addEventListener('click', () => {
        footer.classList.toggle('footer--visible');
        toggleBtn.classList.toggle('footer-toggle--responsif');
        toggleBtn.textContent = footer.classList.contains('footer--visible')
            ? 'Tutup Footer'
            : 'Lihat Footer';
    });
}
