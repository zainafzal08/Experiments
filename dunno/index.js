const IS_DEV = true;

function log(msg, level) {
    if (level === 'INFO' && IS_DEV) {
        console.log(msg);
    } else if (level === 'WARN') {
        console.warn(msg);
    }
}

function wait(seconds) {
    return new Promise(r => setTimeout(r, seconds * 1000));
}

async function typewrite(element, text) {
    const delay = .1;
    for (const l of text) {
        element.innerText += l;
        await wait(delay)
    }
}

function ifDefined(v, fallback) {
    if (v === undefined) {
        return fallback;
    }
    return v;
}

async function cssAnimation(element, className, options = {}) {
    const removeAfter = ifDefined(options.removeAfter, false);
    const duration = ifDefined(options.duration, 1);
    let done = new Promise(resolve => {
        element.addEventListener('animationend', resolve, { once: true });
    });
    element.style.animationDuration = `${duration}s`;

    element.classList.add(className);
    await done;
    if (removeAfter) {
        element.remove();
    }
}

const fade_out = (element, duration) => {
    return cssAnimation(element, 'fade-out', {
        duration: Number(duration),
        removeAfter: true
    });
};

const fade_in = (element, duration) => {
    return cssAnimation(element, 'fade-in', {
        duration: Number(duration)
    });
};

const stamp = (element) => {
    return cssAnimation(element, 'stamp', { duration: .8 });
}

const spiral = (element, adjustment) => {
    if (adjustment === "reflect") {
        return cssAnimation(element, 'spiral-reflection', {
            duration: 1.5,
            removeAfter: true
        });
    }
    return cssAnimation(element, 'spiral', { duration: 1.5 });
}

const ripple = (element) => {
    return cssAnimation(element, 'ripple', { duration: .4, removeAfter: true });
}

const grow = (element) => {
    return cssAnimation(element, 'grow', { duration: .6 });
}

const wiper = (element) => {
    return cssAnimation(element, 'wiper', { duration: 3 });
}

const move_y = (element, duration) => {
    return cssAnimation(element, 'move-y', {
        duration: Number(duration)
    });
}

function parseAnimations(commandString) {
    const animations = [];
    for (const command of commandString.split('|')) {
        const [idString, argString] = command.split(':');
        let isAsync;
        let id;
        if (idString[0] === '-') {
            isAsync = true;
            id = idString.substr(1);
        } else {
            isAsync = false;
            id = idString;
        }
        animations.push({
            id,
            isAsync,
            args: argString ? argString.split(',') : []
        });
    }
    return animations;
}

const ANIMATION_FUNCTION_FROM_ID = {
    'fade_out': fade_out,
    'fade_in': fade_in,
    'typewrite': typewrite,
    'stamp': stamp,
    'wait': (e, seconds) => wait(Number(seconds)),
    'spiral': spiral,
    'ripple': ripple,
    'grow': grow,
    'wiper': wiper,
    'move_y': move_y
};

window.onload = async() => {
    const allAnimatedElements =
        Array.from(document.querySelectorAll('[data-animation-step]'))
        .sort((a, b) => Number(a.dataset.animationStep) - Number(b.dataset.animationStep));
    for (const element of allAnimatedElements) {
        log(`Running animation ${element.dataset.animationStep}`, 'INFO');
        element.classList.add('shown');
        for (const animation of parseAnimations(element.dataset.animations)) {
            const { id, isAsync, args } = animation;
            log(`... Executing ${id}`, 'INFO');
            const executeAnimation = ANIMATION_FUNCTION_FROM_ID[id];
            if (!executeAnimation) {
                console.warn(`${id} is not a known animation`);
                continue;
            }
            const finished = executeAnimation(element, ...args);
            if (!isAsync) {
                await finished;
            }
        }
    }
};