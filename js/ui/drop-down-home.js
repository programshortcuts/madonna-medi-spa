// drop-down-home.js
import { pauseAllVideos } from "../video/video-controls.js";

export function initDropDownHome() {
    // Only initialize on the home page
    const homeContainer = document.querySelector('.page-container.home-page-container');
    if (!homeContainer) return;


    // Initialize service title downs inside the home services swiper

    // Attach listeners to dropdowns (click) but scoped to home container
    const serviceSlides = homeContainer.querySelectorAll(
        ".services-swiper .swiper-slide.service"
    );
    serviceSlides.forEach(slide => {

        slide.addEventListener("click", serviceClick);


        slide.addEventListener("keydown", serviceKeydown);
        

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
    function serviceClick(e) {

        // Ignore clicks inside expanded content
        if (e.target.closest(".content")) return;

        e.preventDefault();

        const slide = e.currentTarget;

        toggleServiceContent(slide);
    }
    function serviceKeydown(e) {
        const key = e.key.toLowerCase()
        if(key != 'enter') return
        e.preventDefault();
        e.stopImmediatePropagation();

        console.log(e.target);
        if(e.target.classList.contains('.swiper-slide')){
            if (!slide) return;
            const slide = e.target.closest('.swiper-slide');
            toggleServiceContent(slide);
        }
        
        


    }
    function toggleServiceContent(slide) {
        const content = slide.querySelector(".content");
    
        if (!content) return;
    
        content.classList.toggle("hide");
    }
}
function hideAllEls(els){
    els.forEach(el => el.classList.add('hide'))
}