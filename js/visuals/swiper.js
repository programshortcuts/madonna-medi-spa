// js/visuals/swiper.js
let reviewsSwiper = null;
let clickedServiceSlide = null;
export let servicesSwiper = null;

export function initReviewsSwiper() {
    const el = document.querySelector('.reviews-swiper');
    if (!el || typeof Swiper === 'undefined') return;

    if (reviewsSwiper) reviewsSwiper.destroy(true, true);

    reviewsSwiper = new Swiper(el, {
        slidesPerView: 1,
        loop: true,
        speed: 700,

        grabCursor: true,
        allowTouchMove: true,

        threshold: 10,

        autoplay: {
            delay: 5000,
            disableOnInteraction: false
        }
    });
}

export function initServicesSwiper() {
    const el = document.querySelector('.services-swiper');
    if (!el || typeof Swiper === 'undefined') return;
    const slides = el.querySelectorAll('.swiper-slide')
    slides.forEach(slide => {
        slide.addEventListener('focus', e => {
            e.target.scrollIntoView({behavior:'auto', 
                                    inline: 'center',
                                    block: 'nearest'})
        })
    })

    if (servicesSwiper) servicesSwiper.destroy(true, true);
    let shouldFocusSlide = false;
    let initialLoad = true;
    servicesSwiper = new Swiper(el, {
        loop: true,
        speed: 300,

        centeredSlides: true,
        // slidesPerView: window.innerWidth < 940 ? 5 : 4,
        slidesPerView: 'auto',

        spaceBetween: 0,

        grabCursor: true,
        allowTouchMove: true,

        threshold: 10,
        touchAngle: 25,

        loopedSlides: el.querySelectorAll('.swiper-slide').length,

        keyboard: {
            enabled: true,
            onlyInViewport: true
        },

        autoplay: {
            delay: 3333,
            disableOnInteraction: true
        },
        on: {
        slideChangeTransitionEnd() {

            // Always update the highlighted button
            syncServiceButton(this);

            // Don't focus the slide on page load
            if (initialLoad) {
                initialLoad = false;
                return;
            }

            // Only focus after the user actually interacted
            if (!shouldFocusSlide) return;

            shouldFocusSlide = false;

            this.slides[this.activeIndex]?.focus();
        }
    }
    });

    // Allow clicking on slides to navigate left/right
    el.addEventListener('click', (e) => {
        const slide = e.target.closest('.swiper-slide');

        if (!slide || !servicesSwiper.slides.includes(slide)) return;

        // Don't navigate if the click was on a button or interactive element
        if (e.target.closest('button, a, [data-no-click]')) return;

        const clickedIndex = servicesSwiper.slides.indexOf(slide);
        if (clickedIndex === -1) return;

        const activeIndex = servicesSwiper.activeIndex;

        // Navigate based on whether the clicked slide is before or after current
        if (clickedIndex < activeIndex) {
            servicesSwiper.slidePrev();
        } else if (clickedIndex > activeIndex) {
            servicesSwiper.slideNext();
        }
        el.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'nearest',
            inline: 'center' });
    });
    el.addEventListener('focusin', (e) => {
        if (e.target.closest('.swiper-slide')) {
            // pauseSwiperTemporarily();
        }
    });

    el.addEventListener('keydown', (e) => {
        servicesSwiper.autoplay.stop(); 
        const key = e.key.toLowerCase()
        if (key === 'enter') {
            if(e.target === clickedServiceSlide) {
                const serviceTitle = e.target.querySelector('.service-title');
                serviceTitle.focus()
                serviceTitle.click()
                return
            }
            const slide = e.target.closest('.swiper-slide');

            if (!slide || !servicesSwiper.slides.includes(slide)) return;

            // Don't navigate if the click was on a button or interactive element
            if (e.target.closest('button, a, [data-no-click]')) return;

            slide.scrollIntoView({
                behavior: 'smooth',
                block: 'center',
                inline: 'nearest'
            });
            clickedServiceSlide = e.target
        }
    });
    document.addEventListener('change', e => {
        console.log('chaning')
    })
    return servicesSwiper; // ✅ CRITICAL ADDITION
}

// FILE: js/visuals/swiper.js

export function initServiceNavController(swiperInstance) {
    const buttons = document.querySelectorAll('.service-col-title');
    if (!buttons.length) return;

    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault()
            const index = Number(btn.dataset.slide);
            if (Number.isNaN(index)) return;

            // IMPORTANT:
            // Use loop-safe method when available
            if (swiperInstance.slideToLoop) {
                swiperInstance.slideToLoop(index);
            } else {
                swiperInstance.slideTo(index);
            }

            // 🚫 DO NOT:
            // - focus()
            // - scrollIntoView()
            // - activeElement manipulation
        });
        btn.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase()
            if (key == 'enter') {
                const index = Number(btn.dataset.slide);
                if (Number.isNaN(index)) return;

                // IMPORTANT:
                // Use loop-safe method when available
                if (swiperInstance.slideToLoop) {
                    swiperInstance.slideToLoop(index);
                } else {
                    swiperInstance.slideTo(index);
                }

                // 🚫 DO NOT:
                // - focus()
                // - scrollIntoView()
                // - activeElement manipulation
            }
        });
    });
}


function syncServiceButton(swiper) {

    // Remove previous highlight
    document
        .querySelectorAll('.service-col-title')
        .forEach(btn => btn.classList.remove('is-focused'));

    // Current active slide
    const slide = swiper.slides[swiper.activeIndex];
    if (!slide) return;

    const target = slide.dataset.navTarget;
    if (!target) return;

    // Find matching button
    const btn = document.querySelector(
        `.service-col-title[data-nav-target="${target.replace('-serv-home', '-col-home-link')}"]`
    );

    btn?.classList.add('is-focused');
}