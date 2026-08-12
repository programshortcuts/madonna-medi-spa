// page-lifecycle.js
import { initReviewsSwiper } from "../visuals/swiper.js";
import { initServicesSwiper, initServiceNavController } from "../services-swiper/services-swiper.js";
import { initDropDown } from "../ui/drop-down.js";
import { initBgSlider } from "../visuals/change-background.js";

export function onPageReady() {
    requestAnimationFrame(() => {

        // ONLY global UI systems here
        initDropDown();
        initBgSlider();

        const reviews = initReviewsSwiper();
        const services = initServicesSwiper();

        initServiceNavController(services);
    });
}