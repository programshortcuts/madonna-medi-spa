// drop-down-med-serv.js
import { pauseAllVideos } from "../video/video-controls.js";
const ACTIVITY_EVENTS_SERV_SECTIONS = [
    'click',
    'pointerdown',   // mouse + touch + pen
    'keydown',
    'focusin',
    'scroll',
    'wheel',
    'touchstart'
];
export function initDropDownMedServ() {
    const medSpaContainer = document.querySelector('.page-container.med-spa-serv-container');
    if (!medSpaContainer) return;
    const serviceSections = Array.from(medSpaContainer.querySelectorAll('.service-section'));
    const contents = medSpaContainer.querySelectorAll('.content')
    const allSectionDetails = Array.from(medSpaContainer.querySelectorAll('.section-details'));
    serviceSections.forEach((section) => {       
        section.tabIndex = 0;
        section.addEventListener('click', handleSectionClick);
        section.addEventListener('keydown', handleSectionKeydown);
        ACTIVITY_EVENTS_SERV_SECTIONS.forEach(type => {
            section.addEventListener(type, e => {
                if(type == 'keydown'){
                    console.log('here');
                    
                    const key = e.key.toLowerCase()
                    // console.log(key);
                    // console.log(e.target);
                    
                    if(key == 'enter'){
                        // e.preventDefault()
                        // e.stopPropagation()
                        e.stopImmediatePropagation()
                        const section = e.target.closest('.service-section')
                        
                        
                        const moreInfoBtn = section.querySelector('.more-info-btn')
                    }
                    
            }
            return
                
            });
        });
    });
    
    function hideAllSectionDetails(){
        allSectionDetails.forEach(el => {
            if(!el.classList.contains('show')){

                el.classList.add('hide')
            }
            
        })
    }
    hideAllSectionDetails()
}
function handleSectionClick(e){
    const section = e.target.closest('.service-section')
    if(!section) return;
    console.log('here');
    toggleSectionInteraction(section, e.target);
}
function handleSectionKeydown(e){
    const serviceSection = e.target.closest('.service-section');
    if(!serviceSection) return;
    
    


    const key = e.key.toLowerCase();
    if(key !== 'enter') return;

    

    e.preventDefault();
    e.stopPropagation();

    if(e.target === serviceSection){
        const sectionDetails = serviceSection.querySelector('.section-details');
        if(sectionDetails){
            toggleHide(sectionDetails);
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
        return;
    }

    if(target.closest('.section-title')){
        toggleHide(content);
    }
}
function toggleHide(el){
    el.classList.toggle('hide');
}