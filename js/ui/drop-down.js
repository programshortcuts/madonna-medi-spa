// drop-down.js
let lastClickedDrop 
import { pauseAllVideos } from "../video/video-controls.js"
export function initDropDown() {
    const serviceSections = document.querySelectorAll('.page-container.med-spa-serv-container .service-section')
    const sectionsPreviews = document.querySelectorAll('.sections-preview') 
    const dropDowns = document.querySelectorAll('.drop-down')
    const downs = document.querySelectorAll('.downs')
    const allMoreInfoButtons = document.querySelectorAll('.more-info-buttons')
    const serviceSectionTitles = document.querySelectorAll('.service-section .section-title')
    hideAllDowns()
    
    serviceSectionTitles.forEach(el=>{
        el.addEventListener('keydown', e => {
            let key = e.key.toLowerCase()
            if(key === 'enter'){
                
                const serviceSection = e.target.closest('.service-section')
                const content = serviceSection.querySelector('.content')
                const sectionsPreview = serviceSection.querySelector('.sections-preview')
                const sectionDetails = serviceSection.querySelector('.section-details')
                // if (content?.classList.toggle('hide')) 
                
                pauseAllVideos()
                
                
            }
        });
    })
    serviceSections.forEach(el => {
        el.addEventListener('click', e => {
            const content = el.querySelector('.section-details')
            if(e.target.tagName === 'P'){
                if (e.target.classList.contains('sections-preview')) {
                    content.classList.toggle('hide')
                }
                
                return
            } else {
                if(e.target.tagName != 'VIDEO' || e.target.tagName != 'IMG'){

                    content.classList.toggle('hide')
                }
                // if (content.classList.contains('hide')) {
                // }
            }
            
        })
        el.addEventListener('keydown', e => {
            const section = e.target.closest('.service-section')
            if(!section)return
            let key = e.key.toLowerCase()
            if(key === 'enter'){
                // e.preventDefault()
                const title = e.target.querySelector('.section-title')
                // title?.focus()
                const sectionDetails = section.querySelector('.section-details')
                // console.log(section)
                sectionDetails.classList.toggle('hide')
            }
        
            const sectionDetails = e.target.closest('.service-section').querySelector('.section-details')
        });
    })
    sectionsPreviews.forEach(el => {
        el.addEventListener('keydown', e => {
            let key = e.key.toLowerCase()
            if(key === 'enter'){
                const sectionDetails = e.target.closest('.service-section').querySelector('.section-details')
                if(sectionDetails.classList.contains('hide')){
                    sectionDetails.classList.remove('hide')
                }
                
            }
        });
    })
    dropDowns.forEach(el => {
        // SUPER IMPORTANT 
        if(el.classList.contains('service-title')){
            const service = el.closest('.service')
            const downs = service.querySelector('.downs')
            downs.classList.add('hide')

        }
        el.removeEventListener('click', toggleContent) // ✅ prevent stacking
        el.addEventListener('click', toggleContent)
        // el.removeEventListener('keydown', toggleContent) // ✅ prevent stacking
        // el.addEventListener('keydown', toggleContent)
    })    
    function toggleContent(e) {
        e.preventDefault()  
        if(e.type === 'click'){
            clickHandler(e)
            return
        }
        if(e.type === 'keydown'){
            keydownHandler(e)
            return
        }
    }
    
    function hideAllDowns(){
        downs.forEach(el => {
            if(!el.classList.contains('hide')) {
                if(el.closest('.cat'))
                el.classList.add('hide')

            }
        })
    }
    function hideEls(els){
        els.forEach(el =>{
            if(!el.classList.contains('hide')){
                el.classList.add('hide')               
            }
        })
    }
    function clickHandler(e){    
        const catTitle = e.target.closest('.cat-title')
        const productTitle = e.target.closest('.products-title')
        const serviceSwiperDropDown = e.target.closest('.service-title.drop-down');
        const sectionTitleDropDown = e.target.closest('.section-title.drop-down')
        // 🟣 PRODUCT DROPDOWN
        if (productTitle) {
            const productsContainers = productTitle.closest('.products')
            if (!productsContainers) return
    
            const downs = productsContainers.querySelector('.products-content.downs')
            if (!downs) return
            downs.classList.toggle('hide')
    
            return
        }
        // 🟣 CAT DROPDOWN
        if (catTitle) {
            const container = e.target.closest('.cat')
            if (!container) return
    
            const downs = container.querySelector('.products-containers.downs')
    
            if (!downs) return
            downs.classList.toggle('hide')
    
            return
        }
        // Services Swiper Dropdown
        if (serviceSwiperDropDown) {
            const service = serviceSwiperDropDown.closest('.service')
            if (!service) return
            // if(!service.classList.contains('drop-down')) return
            const downs = service.querySelector('.downs')
            if (!downs) return
            // if(e.target === lastClickedDrop){
            //     downs.classList.toggle('hide')
            // } else {
            //     hideAllDowns()
            // }
            downs.classList.toggle('hide')
            lastClickedDrop = e.target
            return
        }
        // 🔵 SECTION DROPDOWN
        if (sectionTitleDropDown) {

            const section = sectionTitleDropDown.closest('.service-section')
            if (!section) return

            const currentDown = section.querySelector('.section-details.downs')
            const moreInfoButtons = section.querySelector('.more-info-buttons')

            if (!currentDown) return


            // hide other open sections
            document.querySelectorAll('.service-section').forEach(otherSection => {

                if (otherSection === section) return

                const otherDown = otherSection.querySelector('.section-details.downs')
                const otherButtons = otherSection.querySelector('.more-info-buttons')

                if (otherDown) {
                    otherDown.classList.add('hide')
                }

                if (otherButtons) {
                    otherButtons.classList.remove('hide')
                }

            })


            // toggle current section
            currentDown.classList.toggle('hide')


            // hide/show current section buttons
            if (moreInfoButtons) {

                if (currentDown.classList.contains('hide')) {
                    moreInfoButtons.classList.remove('hide')
                }
                else {
                    moreInfoButtons.classList.add('hide')
                }

            }

            return
        }
        
    }
    function keydownHandler(e){    
        
        const key = e.key.toLowerCase()
        const sectionTitleDropDown = e.target.closest('.section-title.drop-down')
        const section = sectionTitleDropDown.closest('.section')
        
        // Services Swiper Dropdown
        if(sectionTitleDropDown) {
            const section = sectionTitleDropDown.closest('.section');
            
            if (!section) return;

            const currentDown = section.querySelector('.content.downs');
            if (!currentDown) return;

            // Hide every OTHER section content
            document.querySelectorAll('.service-section .content.downs').forEach(el => {
                if (el !== currentDown) {
                    el.classList.add('hide');
                }
            });

            // Toggle clicked section
            currentDown.classList.toggle('hide');

            lastClickedDrop = e.target;
            return;
        }
    }
    // function moreInfoButtonsToggle(e,currentDown){
    //     // const moreInfoButtons = e.target.closest('.more-info-buttons')
    //     if (e.target.classList.contains('section-title')) {

    //         // allMoreInfoButtons.forEach(el => {
    //         //     if(el.clasList.contains('hide')) el.remove('hide')
    //         // })
    //         return
    //     } else if (e.target.parentElement.clasList.contains('more-info-buttons')) {
            
    //         moreInfoButtons.classList.add('hide')
    //         if (!currentDown.classList.contains('hide')) {
    //         } else {
    //             moreInfoButtons.classList.remove('hide')
    //         }
    //     }

    // }
}

