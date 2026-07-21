// drop-down-home.js
import { pauseAllVideos } from "../video/video-controls.js";

export function initDropDownHome() {
    // Only initialize on the home page
    const homeContainer = document.querySelector('.page-container.home-page-container');
    if (!homeContainer) return;

    let lastClickedDrop;

    const dropDowns = homeContainer.querySelectorAll('.drop-down');

    // Initialize service title downs inside the home services swiper
    // Ensure any service-specific downs are hidden initially
    const serviceElements = homeContainer.querySelectorAll('.service');
    serviceElements.forEach(service => {
        const downs = service.querySelector('.downs');
        if (downs) downs.classList.add('hide');
    });

    // Attach listeners to dropdowns (click) but scoped to home container
    dropDowns.forEach(el => {
        // Prevent stacking handlers
        el.removeEventListener('click', toggleContent);
        el.addEventListener('click', toggleContent);
    });

    function toggleContent(e) {
        e.preventDefault();
        if (e.type === 'click') {
            clickHandler(e);
            return;
        }
        if (e.type === 'keydown') {
            keydownHandler(e);
            return;
        }
    }

    function clickHandler(e) {
        // PRODUCT and CAT dropdowns are not primary on home page but keep behavior
        const catTitle = e.target.closest('.cat-title');
        const productTitle = e.target.closest('.products-title');
        const serviceSwiperDropDown = e.target.closest('.service-title.drop-down');

        // PRODUCT DROPDOWN
        if (productTitle) {
            const productsContainers = productTitle.closest('.products');
            if (!productsContainers) return;
            const downs = productsContainers.querySelector('.products-content.downs');
            if (!downs) return;
            downs.classList.toggle('hide');
            return;
        }

        // CAT DROPDOWN
        if (catTitle) {
            const container = e.target.closest('.cat');
            if (!container) return;
            const downs = container.querySelector('.products-containers.downs');
            if (!downs) return;
            downs.classList.toggle('hide');
            return;
        }

        // Services Swiper Dropdown (home service tiles)
        if (serviceSwiperDropDown) {
            const service = serviceSwiperDropDown.closest('.service');
            if (!service) return;
            const downs = service.querySelector('.downs');
            if (!downs) return;
            downs.classList.toggle('hide');
            lastClickedDrop = e.target;
            return;
        }

        // If click reaches here, no known handler
    }

    function keydownHandler(e) {
        const key = e.key.toLowerCase();
        const serviceTitle = e.target.closest('.service-title.drop-down');
        if (serviceTitle && (key === 'enter' || key === ' ')) {
            const service = serviceTitle.closest('.service');
            if (!service) return;
            const currentDown = service.querySelector('.content.downs') || service.querySelector('.downs');
            if (!currentDown) return;

            // Hide other service contents
            homeContainer.querySelectorAll('.service .content.downs, .service .downs').forEach(el => {
                if (el !== currentDown) el.classList.add('hide');
            });

            currentDown.classList.toggle('hide');
            lastClickedDrop = e.target;
        }
    }
}
