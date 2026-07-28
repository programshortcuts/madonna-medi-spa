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
    }
    hideAllSectionDetails()
}
function handleSectionClick(e){
    const section = e.target.closest('.service-section')
    const content = section.querySelector('.content');
    const sectionDetails = section.querySelector('.section-details');
    if(e.target.closest('.section-preview')){
        console.log('preview');    
        toggleHide(sectionDetails);
        return
    }
    if(e.target.closest('.section-title')){
        toggleHide(content);
        console.log('title');
    }
    
}
function handleSectionKeydown(e){
    const section = e.target.closest('.service-section')
    const sectionDetails = section.querySelector('.section-details');
    if(e.target.closest('.section-title')){
        toggleHide(sectionDetails);
        
    }
}


function toggleHide(el){
    el.classList.toggle('hide');
}