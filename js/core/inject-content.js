// inject-content.js
import { initAllVideos } from "../video/video-controls.js";
// 🔥 Ensure correct default page
// export const DEFAULT_PAGE = "pages/home/home.html";
export const DEFAULT_PAGE = "pages/medical-spa-services/medical-spa-services.html";
// export const DEFAULT_PAGE = "pages/products/products.html";
// export const DEFAULT_PAGE = "pages/contact/contact.html";
// export const DEFAULT_PAGE = "pages/bookings/bookings.html";

// inject-content.js
import { initZoomItems } from "../ui/zoom-items.js";
import { onPageReady } from "./page-lifecycle.js";
import { isSafePath } from "./security-utils.js";
import { initItemsScroll } from "../ui/items-scroll.js";
import { initProductsController } from "../ui/products-controller.js";

import { initBgSlider } from "../visuals/change-background.js";
import { initDropDown } from "../ui/drop-down.js";

export const mainLandingPage = document.querySelector('.main-landing-page');
export const pageWrapper = document.querySelector('.page-wrapper');

if (!mainLandingPage) {
    throw new Error("Missing .main-landing-page in index.html");
}


const pageCache = new Map();
let lastClickedLink = null;

/* -----------------------------
   GLOBAL FORM SAFETY
----------------------------- */
document.addEventListener("submit", (e) => {
    if (e.target.id === "contact-form") {
        e.preventDefault();
        mainLandingPage.textContent = "Form submission blocked";
    }
});
/* -----------------------------
   INIT ENTRY POINT
----------------------------- */
export function initInjectContentListeners() {
    // ✅ FIX: ensure DOM is ready before first injection
    requestAnimationFrame(() => {
        injectPage(DEFAULT_PAGE);
    });
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a[data-link]');
        if (!link) return;
        const href = link.getAttribute('href');
        if (!href || href === '#' || href === 'undefined') {
            console.warn('Blocked bad href:', href);
            return;
        }
        e.preventDefault();
        injectPage(href);
        window.scrollTo(0, 0);
        mainLandingPage.scrollTo(0, 0);
        if (link === lastClickedLink) {
            mainLandingPage.focus();
            if (pageWrapper?.classList.contains('expand')) {
                pageWrapper.classList.remove('expand');
            }
            lastClickedLink = null;
            return;
        }
        lastClickedLink = link;
        
    });
}
/* ----------------------------- PAGE INJECTION CORE
----------------------------- */
export async function injectPage(href) {
    if (!href) return;
    if (!isSafePath(href)) {
        console.warn('Blocked unsafe path:', href);
        return;
    }
    let html;
    try {
        if (pageCache.has(href)) {
            html = pageCache.get(href);
        } else {
            const res = await fetch(href);

            if (!res.ok) {
                throw new Error(`Failed to fetch ${href} (${res.status})`);
            }

            html = await res.text();
            pageCache.set(href, html);
        }

    } catch (err) {
        console.error(err);
        mainLandingPage.textContent = `Failed to load page: ${href}`;
        return;
    }

    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // 🔥 Remove broken attributes
    doc.querySelectorAll("[src], [href], [action]").forEach(el => {
        ["src", "href", "action"].forEach(attr => {
            const val = el.getAttribute(attr);
            if (val === "undefined") {
                el.removeAttribute(attr);
            }
        });
    });

    // 🔥 Remove external scripts + styles from injected page
    doc.querySelectorAll('link, script').forEach(el => el.remove());

    const newContent = doc.querySelector(".page-container");

    if (!newContent) {
        console.error("Missing .page-container in:", href);
        mainLandingPage.textContent = `Invalid page structure: ${href}`;
        return;
    }

    // -----------------------------
    // INJECT
    // -----------------------------
    mainLandingPage.innerHTML = DOMPurify.sanitize(newContent.outerHTML, {
        ALLOWED_TAGS: [
            'video',
            'form', 'input', 'textarea', 'label',
            'div', 'p', 'span', 'ul', 'ol', 'li',
            'pre', 'code',
            'img',
            'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
            'a', 'section', 'article', 'header', 'footer',
            'iframe', 'button', 'canvas',
            'svg', 'path', 'circle', 'g'
        ],
        ALLOWED_ATTR: [
            'autoplay','loop','controls','playsinline',
            'src', 'href', 'class', 'id', 'alt', 'tabindex',
            'allow', 'allowfullscreen', 'frameborder',
            'width', 'height', 'viewBox', 'fill', 'd', 'cx', 'cy', 'r',
            'type', 'name', 'value', 'for', 'required', 'action', 'method',

            'min',
            'max',
            'step',

            'data-auto-focus',
            'data-nav-target',
            'data-link',
            'aria-expanded',
            'aria-controls'
        ]
    });

    requestAnimationFrame(() => {
        const firstSection = mainLandingPage.querySelector(".sections-containers");
        
        if (firstSection) {
            firstSection.scrollIntoView({
                block: "start",
                behavior: "instant"
            });
        }
        initAllVideos(mainLandingPage)
    });

    // -----------------------------
    // AUTO FOCUS
    // -----------------------------
    const autoFocusEl = mainLandingPage.querySelector('[data-auto-focus]');

    if (autoFocusEl) {
        requestAnimationFrame(() => {
            autoFocusEl.focus();
            autoFocusEl.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        });
    }
    // -----------------------------
    // RESET VIEW
    // -----------------------------
    requestAnimationFrame(() => {
        pageWrapper.scrollTop = 0;
    });
    onPageReady();
    // -----------------------------
    // INIT UI MODULES
    // -----------------------------
    initProductsController();
    initItemsScroll();
    initZoomItems();

    // OPTIONAL PAGE-SPECIFIC INIT
    if (href.includes("bookings")) {
        // initBookingForm(); // keep commented if not imported
    }
}