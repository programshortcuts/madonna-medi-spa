// drop-down-med-serv.js
import { pauseAllVideos } from "../video/video-controls.js";

export function initDropDownMedServ() {
    const medSpaContainer = document.querySelector('.page-container.med-spa-serv-container');
    if (!medSpaContainer) return;
    const serviceSections = Array.from(medSpaContainer.querySelectorAll('.service-section'));
    const allSectionDetails = Array.from(medSpaContainer.querySelectorAll('.section-details'));
    serviceSections.forEach((section) => {       
        section.tabIndex = 0;
        section.addEventListener('click', handleSectionClick);
        section.addEventListener('keydown', handleSectionKeydown);
    });


    function hideAllSectionDetails(){
        allSectionDetails.forEach(el => {
            el.classList.add('hide')
            
        })
        serviceSections.forEach((section) => {
            syncMoreInfoButtonVisibility(section);
        })
    }
    hideAllSectionDetails()
}
function handleSectionClick(e){
    const section = e.target.closest('.service-section')
    if(!section) return;

    toggleSectionInteraction(section, e.target);
}
function handleSectionKeydown(e){
    const key = e.key.toLowerCase();
    if(key !== 'enter') return;

    const serviceSection = e.target.closest('.service-section');
    if(!serviceSection) return;

    e.preventDefault();
    e.stopPropagation();

    if(e.target === serviceSection){
        const sectionDetails = serviceSection.querySelector('.section-details');
        if(sectionDetails){
            toggleHide(sectionDetails);
            syncMoreInfoButtonVisibility(serviceSection);
            return;
        }
    }

    toggleSectionInteraction(serviceSection, e.target);
}
function toggleSectionInteraction(section, target){
    const content = section.querySelector('.content');
    const sectionDetails = section.querySelector('.section-details');

    if(!content || !sectionDetails) return;

    if(target.closest('.section-preview')){
        toggleHide(sectionDetails);
        syncMoreInfoButtonVisibility(section);
        return;
    }

    if(target.closest('.section-title')){
        toggleHide(content);
        syncMoreInfoButtonVisibility(section);
    }
}
function syncMoreInfoButtonVisibility(section){
    const buttons = section.querySelector('.more-info-buttons');
    const details = section.querySelector('.section-details');

    if(!buttons || !details) return;

    buttons.classList.toggle('is-hidden', !details.classList.contains('hide'));
}
function toggleHide(el){
    el.classList.toggle('hide');
}