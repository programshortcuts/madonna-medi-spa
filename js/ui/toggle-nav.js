// toggle-nav.js
import { mainLandingPage } from "../core/inject-content.js"
import { pageWrapper } from "../core/inject-content.js"
let navInitialized = false
export function initToggleNav() {
    if (navInitialized) return
    navInitialized = true
    const sideNavBtn = document.querySelector('#sideNavBtn')
    const imgSmoke = document.querySelector('#madonnaShilouetteLogo')
    
    
    sideNavBtn.addEventListener('keydown', (e) => {
        const key = e.key.toLowerCase()
        if(key == 'enter'){
            expandToggle()
        }
    });
    sideNavBtn.addEventListener('click', (e) => {
        // const mobileHeaderNavUl = document.querySelector('.mobile-header-nav > ul') 
        console.log('here')
        expandToggle()

    });
    function expandToggle(){
        pageWrapper.classList.toggle('expand')   
    }
    mainLandingPage.addEventListener('focus', (e) => {
        // console.log('here')
        if(pageWrapper.classList.contains('expand')){
            pageWrapper.classList.remove('expand')
        }
    });
    

    document.addEventListener('click', closeNavIfOutside);
    document.addEventListener('keydown', closeNavIfOutside);
}
function closeNavIfOutside(e) {
    if (!pageWrapper.classList.contains('expand')) return;

    const mobileNav = document.querySelector('.mobile-header-nav');

    // Don't close if click/key originated from the menu button
    if (e.target.closest('#sideNavBtn')) return;

    if (!mobileNav?.contains(e.target)) {
        pageWrapper.classList.remove('expand');
    }
}