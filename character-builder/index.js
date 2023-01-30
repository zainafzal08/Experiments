import { OPTIONS } from "./face.js";

const selections = new Map();

function syncToDom() {
    for (const element of document.querySelectorAll('[data-text]')) {
        const target = element.dataset.text;
        const selectionIndex = selections.get(target);
        const name = Object.keys(OPTIONS[target])[selectionIndex];
        element.innerText = name;
    }
    for (const [option, variations] of Object.entries(OPTIONS)) {
        const id = `${option}-svg`;
        const prev = document.querySelector(`#${id}`);
        if (prev) {
            prev.remove();
        }
        const idx = selections.get(option);
        const currVariation = Object.values(variations)[idx];
        currVariation.id = id;
        document.querySelector(".preview").append(currVariation);
    }

}

function init() {
    for (const k of Object.keys(OPTIONS)) {
        selections.set(k, 0);
    }
    syncToDom();

    for (const element of document.querySelectorAll('[data-cycles-forward]')) {
        element.addEventListener('click', () => {
            const targetName = element.dataset.cyclesForward;
            const target = OPTIONS[targetName];
            
            const variations = Object.values(target);
            const variationIndex = selections.get(targetName);
            const numVariations = variations.length;

            const newIndex = (variationIndex + 1) % numVariations;

            selections.set(targetName, newIndex);
            syncToDom();
        });
    }

    for (const element of document.querySelectorAll('[data-cycles-backward]')) {
        element.addEventListener('click', () => {
            const targetName = element.dataset.cyclesBackward;
            const target = OPTIONS[targetName];
            const variations = Object.values(target);
            const variationIndex = selections.get(targetName);
            const numVariations = variations.length;

            const newIndex = variationIndex === 0 ? numVariations - 1 : variationIndex - 1;

            selections.set(targetName, newIndex);
            syncToDom();
        });
    }
}

window.onload = init;