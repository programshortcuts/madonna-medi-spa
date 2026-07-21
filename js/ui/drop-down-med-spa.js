// drop-down-med-spa.js
import { pauseAllVideos } from "../video/video-controls.js";

export function initDropDownMedSpa() {
    // Only initialize on the medical spa services pages
    const medSpaContainer = document.querySelector('.page-container.med-spa-serv-container');
    if (!medSpaContainer) return;

    const serviceSections = medSpaContainer.querySelectorAll('.service-section');
    const sectionsPreviews = medSpaContainer.querySelectorAll('.sections-preview');
    const downs = medSpaContainer.querySelectorAll('.downs');
    const allMoreInfoButtons = medSpaContainer.querySelectorAll('.more-info-buttons button');
    const serviceSectionTitles = medSpaContainer.querySelectorAll('.service-section .section-title');

    hideAllDowns();

    allMoreInfoButtons.forEach(el => {
        el.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key === 'enter') {
                const section = e.target.closest('.section');
                const serviceDetails = section.querySelector('.service-details');
                if (serviceDetails) serviceDetails.classList.toggle('hide');
            }
        });
    });

    serviceSectionTitles.forEach(el => {
        el.addEventListener('keydown', e => {
            let key = e.key.toLowerCase();
            if (key === 'enter') {
                const section = e.target.closest('.service-section');
                hideAllDowns();
                const serviceDetails = section.querySelector('.service-details');
                if (serviceDetails) serviceDetails.classList.toggle('hide');
                pauseAllVideos();
            }
        });
    });

    serviceSections.forEach(el => {
        el.addEventListener('click', e => {
            const sectionDetails = el.querySelector('.section-details');
            const moreInfoButton = el.querySelector('.more-info-buttons ');

            // If a preview paragraph was clicked, toggle this section only
            if (e.target.tagName === 'P') {
                if (e.target.classList.contains('sections-preview')) {
                    // Hide other section-details and pause other videos
                    medSpaContainer.querySelectorAll('.service-section .section-details').forEach(other => {
                        if (other !== sectionDetails) other.classList.add('hide');
                    });
                    const currentVid = el.querySelector('video');
                    pauseAllVideos(document, currentVid);

                    if (sectionDetails) sectionDetails.classList.toggle('hide');
                }

                return;
            } else {
                // Do not toggle when clicking a video or an image inside the section
                if (e.target.tagName !== 'VIDEO' && e.target.tagName !== 'IMG') {
                    // Hide other section-details so only this one is visible
                    medSpaContainer.querySelectorAll('.service-section .section-details').forEach(other => {
                        if (other !== sectionDetails) other.classList.add('hide');
                    });

                    // Pause all other videos (but keep any video inside the clicked section playing)
                    const currentVid = el.querySelector('video');
                    pauseAllVideos(document, currentVid);

                    if (sectionDetails) sectionDetails.classList.toggle('hide');
                }
            }

            if (sectionDetails && !sectionDetails.classList.contains('hide')) {
                if (moreInfoButton) moreInfoButton.classList.add('hide');
            } else {
                if (moreInfoButton) moreInfoButton.classList.remove('hide');
            }

        });

        el.addEventListener('keydown', e => {
            let key = e.key.toLowerCase();
            if (key === 'enter') {
                const section = e.target.closest('.service-section');
                if (!section) return;
                const title = e.target.querySelector('.section-title');
                const sectionDetails = section.querySelector('.section-details');
                const moreInfoButton = section.querySelector('.more-info-buttons ');

                // Hide other section-details and pause other videos for keyboard activation
                medSpaContainer.querySelectorAll('.service-section .section-details').forEach(other => {
                    if (other !== sectionDetails) other.classList.add('hide');
                });
                const currentVid = section.querySelector('video');
                pauseAllVideos(document, currentVid);

                if (sectionDetails) sectionDetails.classList.toggle('hide');

                if (moreInfoButton && !moreInfoButton.classList.contains('hide')) {
                    moreInfoButton.classList.add('hide');
                } else if (moreInfoButton) {
                    moreInfoButton.classList.remove('hide');
                }
            }

        });
    });

    sectionsPreviews.forEach(el => {
        el.addEventListener('keydown', e => {
            let key = e.key.toLowerCase();
            if (key === 'enter') {
                const sectionDetails = e.target.closest('.service-section').querySelector('.section-details');
                if (sectionDetails && sectionDetails.classList.contains('hide')) {
                    sectionDetails.classList.remove('hide');
                }

            }
        });
    });

    // Attach generic section-title drop-down handling scoped to medSpaContainer
    const dropDowns = medSpaContainer.querySelectorAll('.drop-down');
    dropDowns.forEach(el => {
        if (el.classList.contains('service-title')) {
            const service = el.closest('.service');
            const downs = service?.querySelector('.downs');
            if (downs) downs.classList.add('hide');
        }
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

    function hideAllDowns() {
        downs.forEach(el => {
            if (!el.classList.contains('hide')) {
                if (el.closest('.cat')) ;
                el.classList.add('hide');
            }
        });
    }

    function clickHandler(e) {
        const serviceSwiperDropDown = e.target.closest('.service-title.drop-down');
        const sectionTitleDropDown = e.target.closest('.section-title.drop-down');

        // Services Swiper Dropdown (if present inside med-spa container)
        if (serviceSwiperDropDown) {
            const service = serviceSwiperDropDown.closest('.service');
            if (!service) return;
            const downs = service.querySelector('.downs');
            if (!downs) return;
            downs.classList.toggle('hide');
            return;
        }

        // SECTION DROPDOWN
        if (sectionTitleDropDown) {
            const section = sectionTitleDropDown.closest('.service-section');
            if (!section) return;

            const currentDown = section.querySelector('.section-details.downs');
            const moreInfoButtons = section.querySelector('.more-info-buttons');

            if (!currentDown) return;

            // hide other open sections
            medSpaContainer.querySelectorAll('.service-section').forEach(otherSection => {
                if (otherSection === section) return;
                const otherDown = otherSection.querySelector('.section-details.downs');
                const otherButtons = otherSection.querySelector('.more-info-buttons');

                if (otherDown) otherDown.classList.add('hide');
                if (otherButtons) otherButtons.classList.remove('hide');
            });

            // toggle current section
            currentDown.classList.toggle('hide');

            // hide/show current section buttons
            if (moreInfoButtons) {
                if (currentDown.classList.contains('hide')) {
                    moreInfoButtons.classList.remove('hide');
                } else {
                    moreInfoButtons.classList.add('hide');
                }
            }

            return;
        }
    }

    function keydownHandler(e) {
        const key = e.key.toLowerCase();
        const sectionTitleDropDown = e.target.closest('.section-title.drop-down');
        if (!sectionTitleDropDown) return;

        const section = sectionTitleDropDown.closest('.section');
        if (!section) return;

        const currentDown = section.querySelector('.content.downs');
        if (!currentDown) return;

        // Hide every OTHER section content
        medSpaContainer.querySelectorAll('.service-section .content.downs').forEach(el => {
            if (el !== currentDown) el.classList.add('hide');
        });

        // Toggle clicked section
        currentDown.classList.toggle('hide');
    }
}
