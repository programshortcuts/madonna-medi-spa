// drop-down-med-serv.js
import { pauseAllVideos } from "../video/video-controls.js";

export function initDropDownMedServ() {
    const medSpaContainer = document.querySelector('.page-container.med-spa-serv-container');
    if (!medSpaContainer) return;
    const serviceSections = Array.from(medSpaContainer.querySelectorAll('.service-section'));
    const sectionDetails = Array.from(medSpaContainer.querySelectorAll('.section-details'));
    serviceSections.forEach((section) => {       
        section.tabIndex = 0;
        section.addEventListener('click', handleSectionClick);
        section.addEventListener('keydown', handleSectionKeydown);
    });


    // function hideAllSectionDetails
}
function handleSectionClick(e){
    const section = e.target.closest('.service-section')
    const content = section.querySelector('.content');
    if(e.target.closest('.section-title')){
        toggleContent(content);
        
    }
    
}
function handleSectionKeydown(e){

}

function toggleContent(content){
    console.log(content);
    content.classList.toggle('hide');
}