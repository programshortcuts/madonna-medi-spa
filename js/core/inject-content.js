// inject-content.js
import { renderPage } from "./render-page.js";
import { medicalSpaServices } from "../../pages/medical-spa-services/medical-spa-services.js";
export const mainLandingPage = document.querySelector('.main-landing-page')
const pages = {
    "medical-spa-services": medicalSpaServices
};


export function injectPage(pageId) {
    const page = pages[pageId];
    if (!page) return;

    renderPage(mainLandingPage, page);
}