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
            } else {
                slide.focus();
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
            } else {
                slide.focus();
            }

            return;
        }

        // Fallback: if click was on slide but not title (handled above), ensure we navigate to it
        if (!servicesSwiper.slides.includes(slide)) return;
        if (Number.isNaN(clickedIndex)) return;

        if (clickedIndex === activeSlideIndex) {
            slide.focus();
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
        servicesSwiper.autoplay.stop(); 
        const key = e.key.toLowerCase()
        
        if (key === 'enter') {
            if(e.target === clickedServiceSlide) {
                const serviceTitle = e.target.querySelector('.service-title');
                console.log(serviceTitle)
                serviceTitle.focus()
                serviceTitle.click()
                return
            }
            const slide = e.target.closest('.swiper-slide');

            if (!slide || !servicesSwiper.slides.includes(slide)) return;
            console.log(slide)
            if(e.target == slide){
                console.log(slide.querySelector('.service-title'))
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
            if (clickedIndex === activeSlideIndex) {
                // Already active — ensure focus and vertical visibility
                slide.focus();
                try {
                    slide.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'nearest' });
                } catch (err) {
                    // fallback: no-op
                }
                return;
            }
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
    document.addEventListener('change', e => {
        // console.log('chaning')
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
                console.log(btn.dataset.slide)
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