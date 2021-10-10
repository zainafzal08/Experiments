const SUBJECTS = [
    'english',
    'science',
    'PDHPE',
    'history',
    'math',
    'food-tech',
    'visual-art'
];

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

let selections = new Array(SUBJECTS.length).fill(-1);

function decode(s) {
    if (s.length < SUBJECTS.length) {
        return new Array(SUBJECTS.length).fill(-1);
    }
    const result = [];
    for (const n of s.split('')) {
        if (n === '-') result.push(-1);
        else result.push(Number(n));
    }
    return result;
}

function init() {
    const defaultValues = decode(window.location.hash.substr(1));
    let shareMode = window.location.hash.length > 1;

    const formElements = [];
    for (let i = 0; i < SUBJECTS.length; i++) {
        const subject = SUBJECTS[i];
        const label = document.createElement('p');
        label.innerText = subject.replace('-', ' ');
        formElements.push(label);

        const colors = document.createElement('div');
        colors.id = subject;
        if (shareMode && defaultValues[i] >= 0) {
            colors.style.backgroundColor = COLORS[defaultValues[i]];
        } else if (!shareMode) {
            renderColorPicker(colors);
        }
        formElements.push(colors);
    }

    selections = defaultValues;
    document.querySelector('.my-container').append(...formElements);
}

function updateUrl() {
    window.location.hash = selections.map(v => v < 0 ? '-' : v).join('');
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
        const index = SUBJECTS.indexOf(div.id);
        selections[index] = Number(e.target.id.split('-')[1]);
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