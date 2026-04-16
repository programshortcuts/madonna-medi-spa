// app.js
import { injectPage } from "./core/inject-content.js";

addEventListener("DOMContentLoaded", initMain);

function initMain() {
    injectPage("medical-spa-services");

    document.addEventListener("keydown", (e) => {
        injectPage(e.key.toLowerCase());
    });
}