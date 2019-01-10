let stats = null;

function parseXML(s) {
    parser = new DOMParser();
    return parser.parseFromString(s,"text/xml");
}
function getRSSFeed(link) {
    return fetch(link)
        .then(r=>r.text())
        .then(r=>parseXML(r))
}
function $(t,settings) {
    const e = document.createElement(t);
    if (!settings) return e ;

    if (settings["className"]) e.className = settings["className"];
    if (settings["innerHTML"]) e.innerHTML = settings["innerHTML"];
    return e
}
function $g(i) {
    return document.getElementById(i);
}
function renderFeed() {
    let rssLink = document.getElementById("link-input").value;
    let feed = document.getElementById("feed");
    getRSSFeed(rssLink)
    .then(r=>{
        $g("title").innerText = r.getElementsByTagName("title")[0].innerHTML;
        return r.getElementsByTagName("item");
    })
    .then(r=>Array(r.length).fill(1).map((x,i)=>r[i]))
    .then(r=>{
        r.map(e=>feed.appendChild(renderItem(e)));
        stats = calculateStats(r);
        renderStats(stats);
        renderCu();
        $g("stats").classList.add("visible");
    })
}

function weeksToHuman(w) {
    const MONTH = 4;
    const YEAR = 52;
    let years = Math.floor(w/YEAR); w = w % YEAR;
    let months = Math.floor(w/MONTH); w = w % MONTH;
    if (years > 0)
        return `${years} years ${months} months and ${w.toPrecision(4)} weeks`
    else if (months > 0)
        return `${months} months and ${w.toPrecision(4)} weeks`
    else 
        return `${w.toPrecision(4)} weeks`
}
function secondsToHuman(s) {
    const HOUR = 3600;
    const MINUTE = 60;
    const DAY = HOUR*24;
    const MONTH = DAY*30;
    const YEAR = DAY*356;
    // TODO: this could be done better
    let years = Math.floor(s / YEAR); s = s % YEAR;
    let months = Math.floor(s / MONTH); s = s % MONTH;
    let days = Math.floor(s / DAY); s = s % DAY;
    let hours = Math.floor(s / HOUR); s = s % HOUR;
    let minutes = Math.floor(s / MINUTE); s = s % MINUTE;
    let seconds = s;
    if (years > 0)
        return `${years}y ${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`
    if (months > 0)
        return `${months}m ${days}d ${hours}h ${minutes}m ${seconds}s`
    if (days > 0)
        return `${days}d ${hours}h ${minutes}m ${seconds}s`
    if (hours > 0)
        return `${hours}h ${minutes}m ${seconds}s`
    if (minutes > 0)
        return `${minutes}m ${seconds}s`
    return `${seconds}s`
}

function toSeconds(x) {
    if (x.length == 1) return x[0]
    if (x.length == 2) return x[0]*60+x[1]
    if (x.length == 3) return x[0]*3600+x[1]*60+x[2]
}
function calculateStats(items) {
    let prev = new Date(get(items.pop(),"pubDate").innerHTML);
    let curr = null;
    let diff = null;
    let totalListen = items.map(x=>get(x,"itunes:duration").innerHTML);
    // durations are in HH:MM:SS (could use  a time library but rather as well flex my functional programming)
    totalListen = totalListen
        .map(x=>x.split(":"))
        .map(x=>x.map(y=>parseInt(y)))
        .map(x=>toSeconds(x))
        .reduce((a,c)=>a+c,0)
    
    const diffs = {};
    const updates = items.length;
    while (items.length > 0) {
        curr = new Date(get(items.pop(),"pubDate").innerHTML);
        diff = Math.round(Math.abs(curr-prev)/1000/60/60/24)
        if (diffs[diff] === undefined) diffs[diff] = 0
        diffs[diff]++
        prev = curr;
    }
    const sortedDiffs = Object.keys(diffs).sort((a,b)=>diffs[b]-diffs[a]);
    const updateFrequency = sortedDiffs[0];
    const misses = sortedDiffs.splice(1).reduce((a,v)=>v > updateFrequency ? a+diffs[v] : a,0)
    return {
        updates,
        updateFrequency,
        misses,
        totalListen
    }
}

// TODO: this is why vue is a babe honestly
function renderStats(stats) {
    const f = stats.updateFrequency;
    let onTimeRate = (stats.updates-stats.misses) / stats.updates;
    onTimeRate = (onTimeRate*100).toFixed(1) + "%";
    $g("total-listen").innerText = secondsToHuman(stats.totalListen);
    $g("count").innerText = stats.updates;
    $g("update-freq").innerText = `Updates about every ${f === 1 ? 'day' : `${f} days`}`;
    $g("ontime-rate-label").innerText = onTimeRate;
    $g("ontime-rate").style.width = onTimeRate;
    $g("ontime-rate-inverse").style.width = `calc(100% - ${onTimeRate})`;
}
function toLocalTime(d) {
    d = new Date(d);
    date = d.toDateString();
    time = d.toLocaleTimeString('en-US');
    time = time.replace(/(\d+):(\d+):(\d+)/,"$1:$2");
    return `${time} ${date}`;
}
function get(e,field) {
    return e.getElementsByTagName(field)[0];
}

function renderItem(e) {
    const container = $("div",{className: "item"});

    const scratch = $("div",{className: "scratch"});
    scratch.appendChild($("span",{
        innerHTML: toLocalTime(get(e,"pubDate").innerHTML)
    }));

    const timeline = $("div",{className: "timeline"});
    timeline.appendChild($("t"));
    timeline.appendChild($("d"));
    timeline.appendChild($("b"));

    const details = $("div",{className: "details"});
    details.appendChild($("div",{className: "card"}));
    container.appendChild(scratch);
    container.appendChild(timeline);
    container.appendChild(details);

    return container;
}
function cu_math(l_rate, r_rate, start_week, start_ep) {
    try {
        const p = (start_ep-l_rate*start_week)/(r_rate-l_rate);
        const r = (p - start_week)
        if (!isFinite(p)) throw Exception("Infinity Result")
        return weeksToHuman(r)
    } catch {
        return "Infinity Weeks! Episodes release faster or at the same rate as you listen to them"
    }
}
function cu_err(m) {
    $g("calc-output").innerText = m;
    $g("calc-output").classList.add("err");
}

function renderCu() {
    if (!stats) return;
    $g("calc-output").classList.remove("err");
    const l_rate = parseInt($g("cu-rate-input").value);
    const start_ep = parseInt($g("cu-start-input").value);
    const r_rate = stats.updateFrequency/7;
    const start_week = stats.updates;
    $g("calc-start").innerText = start_ep;
    $g("calc-rate").innerText = l_rate;
    if (l_rate > 24*7){ cu_err("That's more then a episode every hour every day!"); return}
    if (l_rate < 1){ cu_err("You gotta listen to at least 1 episode a week"); return}
    if (start_ep < 1){ cu_err("How you gonna start at a episode before episode 1 mr.user"); return}
    if (start_ep > stats.updates){ cu_err("How you gonna start at a episode after the latest episode mr.user"); return}    
    $g("calc-output").innerText = cu_math(l_rate, r_rate, start_week, start_ep);
}

class Handler {
    constructor(f) {
        this.f = f;
    }

}
window.onload = function () {

    document.getElementById("link-input").addEventListener("change", x=>{
        renderFeed();
    })
    document.getElementById("cu-rate-input").addEventListener("change", x=>{
        renderCu();
    })
    document.getElementById("cu-start-input").addEventListener("change", x=>{
        renderCu();
    }) 
}