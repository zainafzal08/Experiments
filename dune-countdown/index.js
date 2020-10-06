function expandForm(v,points) {
    const results = []
    for (point of points) {
        results.push(Math.floor(v/point));
        v = v % point;
    }
    results.push(v);
    return results;  
}

function secondsToHuman(s) {
    const HOUR = 3600;
    const MINUTE = 60;
    const DAY = HOUR*24;
    const points = [DAY,HOUR,MINUTE];
    let breakdown = expandForm(s,points);
    r = breakdown.map(x => Math.floor(x)).map(x => x < 10 ? '0'+x : x)
    return `${r[0]} days ${r[1]} hours ${r[2]} minutes ${r[3]} seconds`
}

const output = document.getElementById('countdown');
const target = moment('2021-09-01');
function tick() {
    output.innerText = secondsToHuman(target.diff(moment())/1000);
}

window.onload = function() {
    particlesJS.load('particles', 'particles.json', function() {
    
    });
    this.setInterval(tick, 500);
    tick();
}
