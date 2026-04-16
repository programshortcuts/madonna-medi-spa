// core/render-page.js
import { mainLandingPage } from "./inject-content.js";
export function renderPage(container, pageData) {
    container.replaceChildren();

    const wrapper = document.createElement("div");
    wrapper.className = "page-container";

    const title = document.createElement("h2");
    title.textContent = pageData.title;
    wrapper.appendChild(title);

    pageData.sections.forEach(section => {
        wrapper.appendChild(renderSection(section));
    });

    container.appendChild(wrapper);
}

function renderSection(section) {
    const sectionEl = document.createElement("section");
    sectionEl.id = section.id;
    sectionEl.className = "section";

    const btn = document.createElement("button");
    btn.className = "section-title";
    btn.textContent = section.title;

    sectionEl.appendChild(btn);

    const content = document.createElement("div");
    content.className = "content";

    section.content.forEach(block => {
        content.appendChild(renderBlock(block));
    });

    sectionEl.appendChild(content);

    return sectionEl;
}

function renderBlock(block) {
    if (block.type === "text") {
        const p = document.createElement("p");
        p.textContent = block.value;
        return p;
    }

    if (block.type === "image") {
        const img = document.createElement("img");
        img.src = block.src;
        img.alt = block.alt || "";
        return img;
    }

    return document.createTextNode("");
}