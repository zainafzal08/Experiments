function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
}

function pickRand(a) {
    return a[getRandomInt(0, a.length)];
}

function generate() {
    const output = document.querySelector('.output');
    const numbers = new Array(10).fill(0).map((_, i) => i + 1);
    const letters = numbers.map(v => String.fromCharCode(64 + v))
    output.innerText = `${pickRand(letters)}${pickRand(numbers)}`;
}