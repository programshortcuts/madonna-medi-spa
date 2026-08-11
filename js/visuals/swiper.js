// js/visuals/swiper.js
let reviewsSwiper = null;
let clickedServiceSlide = null;
export let servicesSwiper = null;
import { initDropDown } from "../ui/drop-down.js";
    
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

    // --- Custom wheel-like spin touch/mouse handling for Services Swiper ---
    (function attachWheelSpinHandlers() {
        const swiperEl = el;
        if (!swiperEl) return;

        let isPointerDown = false;
        let startX = 0;
        let lastX = 0;
        let startTime = 0;

        function onPointerDown(ev) {
            // Ignore gestures that originate on interactive elements
            const interactiveTarget = ev.target && ev.target.closest && ev.target.closest('button, a, input, textarea, select, [data-no-click]');
            if (interactiveTarget) return;

            // Only allow primary mouse button for mouse pointers
            if (ev.pointerType === 'mouse' && ev.button !== 0) return;

            isPointerDown = true;
            startX = ev.clientX;
            lastX = startX;
            startTime = ev.timeStamp || Date.now();
            try { swiperEl.setPointerCapture && swiperEl.setPointerCapture(ev.pointerId); } catch (e) {}
            // Temporarily disable Swiper's native touch move so we can decide behavior
            try { servicesSwiper.allowTouchMove = false; } catch (e) {}
        }

        function onPointerMove(ev) {
            if (!isPointerDown) return;
            lastX = ev.clientX;
        }

        function onPointerUp(ev) {
            if (!isPointerDown) return;
            isPointerDown = false;
            try { swiperEl.releasePointerCapture && swiperEl.releasePointerCapture(ev.pointerId); } catch (e) {}

            const endX = ev.clientX;
            const deltaX = endX - startX;
            const absDist = Math.abs(deltaX);
            const width = swiperEl.clientWidth || swiperEl.getBoundingClientRect().width || 1;
            const ratio = absDist / width;
            const durationMs = Math.max(1, (ev.timeStamp || Date.now()) - startTime);

            // Re-enable Swiper's touch handling now
            try { servicesSwiper.allowTouchMove = true; } catch (e) {}

            // Small swipe: less than 25% => exactly one slide
            if (ratio < 0.25) {
                if (deltaX < 0) {
                    servicesSwiper.slideNext(300);
                } else {
                    servicesSwiper.slidePrev(300);
                }
                return;
            }

            // Large swipe: compute momentum-driven slides to move
            const velocity = absDist / durationMs; // px per ms
            const baseSlides = Math.min(50, Math.round(ratio * 12));
            const velocitySlides = Math.round(velocity * 50);
            const slidesToMove = Math.max(1, Math.min(80, baseSlides + velocitySlides));

            const direction = deltaX < 0 ? 1 : -1; // left drag -> advance left
            const currentIndex = typeof servicesSwiper.realIndex === 'number' ? servicesSwiper.realIndex : servicesSwiper.activeIndex;
            const targetIndex = (currentIndex || 0) + direction * slidesToMove;

            const animDuration = Math.min(4000, 350 + slidesToMove * 120);

            if (typeof servicesSwiper.slideToLoop === 'function') {
                servicesSwiper.slideToLoop(targetIndex, animDuration);
            } else {
                servicesSwiper.slideTo(targetIndex, animDuration);
            }
        }

        swiperEl.addEventListener('pointerdown', onPointerDown);
        swiperEl.addEventListener('pointermove', onPointerMove);
        swiperEl.addEventListener('pointerup', onPointerUp);
        swiperEl.addEventListener('pointercancel', onPointerUp);
    })();
}

export function initServicesSwiper() {
    initDropDown()
    const el = document.querySelector('.services-swiper');
    if (!el || typeof Swiper === 'undefined') return;
    const slides = el.querySelectorAll('.services-swiper .swiper-slide')
    slides.forEach(el => {
        el.addEventListener('focusin', e => {
            const swiperWrapper = el.closest('.swiper-wrapper')
            swiperWrapper.scrollIntoView({behavior:'instant', block:'nearest', inline: 'start'})
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

    // Allow clicking on slides to navigate directly to the clicked slide and then focus it.
    el.addEventListener('click', (e) => {
        const target = e.target instanceof Element ? e.target : e.target.parentElement;
        const slide = target?.closest('.swiper-slide');
        if (!slide) return;

        const content = slide.querySelector('.content');
        const serviceTitleButton = target.closest('.service-title');
        const isTitleTextClick = !!target.closest('.title-text');

        servicesSwiper.autoplay.stop();

        const clickedIndex = Number(slide.dataset.swiperSlideIndex ?? servicesSwiper.slides.indexOf(slide));
        const activeSlideIndex = typeof servicesSwiper.realIndex === 'number'
            ? servicesSwiper.realIndex
            : servicesSwiper.activeIndex;

        // If the click originated from a nested interactive element (other than the service title), ignore it
        if (target.closest('button, a, [data-no-click]') && !serviceTitleButton) return;

        // If click was on the service-title button, do not toggle content here (drop-down.js manages it).
        if (serviceTitleButton) {
            if (!servicesSwiper.slides.includes(slide)) return;
            if (Number.isNaN(clickedIndex)) return;

            if (clickedIndex !== activeSlideIndex) {
                shouldFocusSlide = true;
                if (servicesSwiper.slideToLoop) {
                    servicesSwiper.slideToLoop(clickedIndex);
                } else {
                    servicesSwiper.slideTo(clickedIndex);
                }

                // After the slide transition, ensure the slide is focused and vertically centered
                setTimeout(() => {
                    const active = servicesSwiper.slides[servicesSwiper.activeIndex];
                    if (active) {
                        try { active.focus({ preventScroll: true }); } catch (e) {}
                        try { active.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); } catch (e) {}
                    }
                }, 350);
            } else {
                try { slide.focus({ preventScroll: true }); } catch (e) {}
                try { slide.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); } catch (e) {}
            }

            return;
        }

        // Clicking the title-text (when not inside the button) or the slide background toggles content and ensures the slide becomes active
        if (isTitleTextClick || target === slide) {
            if (content) {
                content.classList.toggle('hide');
            }

            if (!servicesSwiper.slides.includes(slide)) return;
            if (Number.isNaN(clickedIndex)) return;

            if (clickedIndex !== activeSlideIndex) {
                shouldFocusSlide = true;
                if (servicesSwiper.slideToLoop) {
                    servicesSwiper.slideToLoop(clickedIndex);
                } else {
                    servicesSwiper.slideTo(clickedIndex);
                }

                // Focus and vertically center after transition
                setTimeout(() => {
                    const active = servicesSwiper.slides[servicesSwiper.activeIndex];
                    if (active) {
                        try { active.focus({ preventScroll: true }); } catch (e) {}
                        try { active.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); } catch (e) {}
                    }
                }, 350);
            } else {
                try { slide.focus({ preventScroll: true }); } catch (e) {}
                try { slide.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); } catch (e) {}
            }

            return;
        }

        // Fallback: if click was on slide but not title (handled above), ensure we navigate to it
        if (!servicesSwiper.slides.includes(slide)) return;
        if (Number.isNaN(clickedIndex)) return;

        if (clickedIndex === activeSlideIndex) {
            try { slide.focus({ preventScroll: true }); } catch (e) {}
            try { slide.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); } catch (e) {}
            return;
        }

        shouldFocusSlide = true;
        if (servicesSwiper.slideToLoop) {
            servicesSwiper.slideToLoop(clickedIndex);
        } else {
            servicesSwiper.slideTo(clickedIndex);
        }
    });
   

    el.addEventListener('keydown', (e) => {
        // Stop autoplay for any keyboard interaction inside the services swiper
        servicesSwiper.autoplay.stop();
        const key = (e.key || '').toLowerCase();

        // If Arrow navigation (left/right) is used while focus is inside the swiper,
        // mark shouldFocusSlide so slideChangeTransitionEnd will focus the active slide.
        if (key === 'arrowleft' || key === 'arrowright') {
            if (el.contains(e.target)) {
                shouldFocusSlide = true;
            }
            return; // allow Swiper to handle the navigation
        }

        if (key === 'enter') {
            if(e.target === clickedServiceSlide) {
                const serviceTitle = e.target.querySelector('.service-title');
                serviceTitle.focus()
                serviceTitle.click()
                return
            }
            const slide = e.target.closest('.swiper-slide');

            if (!slide || !servicesSwiper.slides.includes(slide)) return;
            if(e.target == slide){
                slide.querySelector('.service-title').focus()
                return

            }
            // Don't navigate if the key event originated from a nested interactive element
            if (e.target.closest('button, a, [data-no-click]')) return;

            const clickedIndex = Number(slide.dataset.swiperSlideIndex ?? servicesSwiper.slides.indexOf(slide));
            const activeSlideIndex = typeof servicesSwiper.realIndex === 'number'
                ? servicesSwiper.realIndex
                : servicesSwiper.activeIndex;

            if (Number.isNaN(clickedIndex)) return;
            // if (clickedIndex === activeSlideIndex) {
            //     // Already active — ensure focus and vertical visibility
            //     try { slide.focus(); } catch (e) {}
            //     try {
            //         // slide.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            //     } catch (err) {
            //         // fallback: no-op
            //     }
            //     return;
            // }
            shouldFocusSlide = true;
            // Ensure vertical scroll to center the slide in viewport while letting Swiper manage horizontal centering
            try {
                slide.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
            } catch (err) {
                // ignore
            }
            if (servicesSwiper.slideToLoop) {
                servicesSwiper.slideToLoop(clickedIndex);
            } else {
                servicesSwiper.slideTo(clickedIndex);
            }
            clickedServiceSlide = e.target;
        }
    });
    
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

            // After navigation, ensure the active slide is focused (no vertical centering on click)
            setTimeout(() => {
                const active = swiperInstance.slides?.[swiperInstance.activeIndex];
                if (active) {
                    try { active.focus({ preventScroll: true }); } catch (e) {}
                    // Intentionally do NOT call scrollIntoView here for click — keep view unchanged
                }
            }, 250);

            // 🚫 DO NOT:
            // - focus() (handled above with preventScroll)
            // - scrollIntoView() (handled intentionally elsewhere)
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

                // After navigation, ensure the active slide is focused and vertically centered
                setTimeout(() => {
                    const active = swiperInstance.slides?.[swiperInstance.activeIndex];
                    if (active) {
                        try { active.focus({ preventScroll: true }); } catch (e) {}
                        try { active.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' }); } catch (e) {}
                    }
                }, 350);

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