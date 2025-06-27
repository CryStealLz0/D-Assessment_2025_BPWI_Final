import routes from '../routes/routes.js';
import { getActiveRoute } from '../routes/url-parser.js';
import { authGuard } from '../middleware/auth-guard.js';
import { transitionHelper } from '../utils/index.js';

class App {
    #content = null;
    #drawerButton = null;
    #navigationDrawer = null;

    constructor({ navigationDrawer, drawerButton, content }) {
        this.#content = content;
        this.#drawerButton = drawerButton;
        this.#navigationDrawer = navigationDrawer;

        this.#setupDrawer();
    }

    #setupDrawer() {
        this.#drawerButton.addEventListener('click', () => {
            this.#navigationDrawer.classList.toggle('open');
        });

        document.body.addEventListener('click', (event) => {
            if (
                !this.#navigationDrawer.contains(event.target) &&
                !this.#drawerButton.contains(event.target)
            ) {
                this.#navigationDrawer.classList.remove('open');
            }

            this.#navigationDrawer.querySelectorAll('a').forEach((link) => {
                if (link.contains(event.target)) {
                    this.#navigationDrawer.classList.remove('open');
                }
            });
        });
    }

    async renderPage() {
        const guardedRoutes = ['#/tambah', '#/'];
        if (!authGuard(guardedRoutes)) return;

        const url = getActiveRoute();
        const page = routes[url];

        const transition = transitionHelper({
            updateDOM: async () => {
                const html = await page.render();
                if (!html) throw new Error('Render returned undefined/null!');
                this.#content.innerHTML = html;
                await page.afterRender();
            },
        });

        transition.updateCallbackDone?.then(() => {
            scrollTo({ top: 0, behavior: 'instant' });
        });
    }
}

export default App;
