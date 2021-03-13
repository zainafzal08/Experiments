let selections = {};

const COLORS = [
    '#127ba3', // Blue
    '#75caeb', // Light Blue
    '#28b62c', // Green
    '#ff851b', // Orange
    '#ff4136', // Red
    '#8F8389', // Grey
    '#F5B700', // Yellow
    '#C60F7B', // Purple
];

function decode(s) {
    const result = {};
    if (!s) {
        return result;
    }
    s = s.substr(1);
    for(const pair of s.split(',')) {
        const [key, value] = pair.split('=');
        result[key] = value;
    }
    return result;
}

function init() {
    const defaultValues = decode(window.location.hash);
    let shareMode = Object.keys(defaultValues).length > 0;

    for (const div of document.querySelectorAll('div')) {
        if (div.dataset.element === "color-picker") {
            if (shareMode && defaultValues[div.id]) {
                const index = parseInt(defaultValues[div.id].split('-')[1]);
                div.style.backgroundColor = COLORS[index];
            } else if (!shareMode) {
                renderColorPicker(div);
            }
        }
    }
    selections = defaultValues;
}

function updateUrl() {
    const hash = Object.entries(selections).map(([a,b]) => `${a}=${b}`).join(',');
    window.location.hash = hash;
}

function colorBox(colorIndex) {
    const div = document.createElement('div');
    div.className = 'color-box';
    div.style.backgroundColor = COLORS[colorIndex];
    div.id = `index-${colorIndex}`;
    return div;
}

function renderColorPicker(div) {
    const allBoxes = [];
    for (colorIndex in COLORS) {
        const box = colorBox(colorIndex);
        allBoxes.push(box);
        div.appendChild(box);
    }
    div.addEventListener('click', (e) => {
        if (e.target.id.split('-')[0] !== 'index') {
            return;
        }
        selections[div.id] = e.target.id;
        for (box of allBoxes) {
            box.classList.remove('selected');
        }
        e.target.classList.add('selected');
        updateUrl();
    });
}

function share() {
    updateUrl();
    const dummy = document.createElement('input');
    document.body.appendChild(dummy);
    dummy.value = window.location.href;
    dummy.select();
    document.execCommand('copy');
    document.body.focus();
    dummy.remove();
}

function clearLink() {
    window.location.hash = '';
    location.reload();
}

window.onload = init;