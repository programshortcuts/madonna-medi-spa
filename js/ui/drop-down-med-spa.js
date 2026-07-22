// drop-down-med-serv.js
import { pauseAllVideos } from "../video/video-controls.js";

export function initDropDownMedSpa() {
    const medSpaContainer = document.querySelector('.page-container.med-spa-serv-container');
    if (!medSpaContainer) return;

    const serviceSections = Array.from(medSpaContainer.querySelectorAll('.service-section'));
    const sectionDetails = Array.from(medSpaContainer.querySelectorAll('.section-details'));
    sectionDetails.forEach(el => {
        console.log(el)
        el.classList.add('hide')}
    )
    serviceSections.forEach((section) => {
        section.tabIndex = 0;
        section.addEventListener('click', handleSectionClick);
        section.addEventListener('keydown', handleSectionKeydown);
        syncSectionTitleState(section);
    });

    function handleSectionClick(event) {
        const section = event.currentTarget;
        const titleButton = getSectionTitleButton(section);
        const clickedTitleButton = event.target.closest('.section-title');

        if (clickedTitleButton && clickedTitleButton === titleButton) {
            toggleSectionContent(section);
            return;
        }

        const previewMoreInfoButton = event.target.closest('.sections-preview .more-info-buttons button');
        const clickedSectionDetails = event.target.closest('.section-details');
        if (clickedSectionDetails && !previewMoreInfoButton) {
            return;
        }

        toggleSectionDetails(section);
    }

    function handleSectionKeydown(event) {
        const key = event.key.toLowerCase();
        if (!isTriggerKey(key)) {
            return;
        }
        if(key === ' '){ return
        }
        const section = event.currentTarget;
        const titleButton = getSectionTitleButton(section);
        const clickedTitleButton = event.target.closest('.section-title');

        if (clickedTitleButton && clickedTitleButton === titleButton) {
            event.preventDefault();
            event.stopPropagation();
            toggleSectionContent(section);
            return;
        }

        const previewMoreInfoButton = event.target.closest('.sections-preview .more-info-buttons button');
        const clickedSectionDetails = event.target.closest('.section-details');
        if (clickedSectionDetails && !previewMoreInfoButton) {
            return;
        }

        event.preventDefault();
        event.stopPropagation();
        toggleSectionDetails(section);
    }

    function toggleSectionContent(section) {
        const content = getSectionContent(section);
        if (!content) return;

        // When toggling the section TITLE, do not hide other sections' content.
        // Only ensure other sections' "section-details" are hidden so details panels don't remain open.
        serviceSections.forEach((otherSection) => {
            if (otherSection === section) return;
            const otherDetails = otherSection.querySelector('.section-details');
            if (otherDetails) {
                otherDetails.classList.add('hide');
            }
        });

        // Toggle only this section's content/preview
        content.classList.toggle('hide');
        console.log(section)
        if(content.classList.contains('hide')){
            section.classList.add('collapse-height')
        } else {
            
            section.classList.remove('collapse-height')
        }
        syncSectionTitleState(section);
        pauseAllVideos(medSpaContainer);
    }

    function toggleSectionDetails(section) {
        const details = section.querySelector('.section-details');
        if (!details) return;

        serviceSections.forEach((otherSection) => {
            const otherDetails = otherSection.querySelector('.section-details');
            if (otherDetails && otherSection !== section) {
                otherDetails.classList.add('hide');
            }
        });

        details.classList.toggle('hide');

        const keepVideo = section.querySelector('video');
        pauseAllVideos(medSpaContainer, keepVideo);
    }

    function getSectionContent(section) {
        return section.querySelector('.content') || section.querySelector('.sections-preview');
    }

    function getSectionTitleButton(section) {
        return Array.from(section.children).find((child) => child.classList.contains('section-title')) || null;
    }

    function syncSectionTitleState(section) {
        const titleButton = getSectionTitleButton(section);
        const content = getSectionContent(section);

        if (!titleButton || !content) return;

        titleButton.setAttribute('aria-expanded', String(!content.classList.contains('hide')));
    }

    function isTriggerKey(key) {
        return key === 'enter' || key === ' ' || key === 'spacebar';
    }
}
