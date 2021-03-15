const CODONS = {
    'a': 'GCA',
    'b': 'GCC',
    'c': 'GCG',
    'd': 'CUA',
    'e': 'GCU',
    'f': 'UGC',
    'g': 'UGU',
    'h': 'GAC',
    'i': 'GAU',
    'j': 'GAA',
    'k': 'GAG',
    'l': 'UUC',
    'm': 'UUU',
    'n': 'GGA',
    'o': 'GGC',
    'p': 'GGG',
    'q': 'GGU',
    'r': 'CAC',
    's': 'CAU',
    't': 'AUA',
    'u': 'AUC',
    'v': 'AUU',
    'w': 'AAA',
    'x': 'AAG',
    'y': 'UUA',
    'z': 'UUG',
};

function setMessage(s) {
    if (s === undefined) {
        s = window.prompt('Whats the message to encode?');
    }
    const encoded = [];
    for (const letter of s) {
        encoded.push(CODONS[letter.toLowerCase()]);
    }
    document.querySelector('.message').textContent = encoded.join(' ');
}

function init() {
    for (const letter of "abcdefghijklmnopqrstuvwxyz") {
        const text = document.createElement('div');
        text.innerText = `${CODONS[letter]} = "${letter.toUpperCase()}"`;
        document.querySelector('.table').appendChild(text);
    }
    setMessage('hello');
}

window.onload = init;