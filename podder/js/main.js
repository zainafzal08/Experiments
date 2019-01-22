function parseXML(s) {
    parser = new DOMParser();
    return parser.parseFromString(s,"text/xml");
}
function getRSSFeed(link) {
    return fetch(link)
        .then(r=>r.text())
        .then(r=>parseXML(r))
}

function expandForm(v,points) {
    const results = []
    for (point of points) {
        results.push(Math.floor(v/point));
        v = v % point;
    }
    results.push(v);
    return results;  
}

function weeksToHuman(w) {
    // [Weeks in a Year, Weeks in a Month]
    const [years,months,weeks] = expandForm(w,[52,4]);

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
    const points = [YEAR,MONTH,DAY,HOUR,MINUTE];
    let breakdown = expandForm(s,points);
    const postMap = [' years',' months',' days','h','m','s']
    breakdown = breakdown.map((x,i)=>`${x}${postMap[i]}`)
    breakdown.reverse()
    let result = breakdown.reduce((a,v)=> parseInt(v.substr(0,v.length-1)) > 0 ? `${v} ${a}` : a,"");
    return result.trim();
}

function toSeconds(x) {
    if (x.length == 1) return x[0]
    if (x.length == 2) return x[0]*60+x[1]
    if (x.length == 3) return x[0]*3600+x[1]*60+x[2]
}

function calculateStats(items) {
    const updates = items.length;
    let curr = null;
    let diff = null;
    let totalListen = items.map(x=>get(x,"itunes:duration").innerHTML);
    let prev = new Date(get(items.pop(),"pubDate").innerHTML);
    // durations are in HH:MM:SS (could use  a time library but rather as well flex my functional programming)
    let totalListenTime = totalListen
        .map(x=>x.split(":"))
        .map(x=>x.map(y=>parseInt(y)))
        .map(x=>toSeconds(x))
        .reduce((a,c)=>a+c,0)
    totalListenTime = secondsToHuman(totalListenTime);
    const diffs = {};
    while (items.length > 0) {
        curr = new Date(get(items.pop(),"pubDate").innerHTML);
        diff = Math.round(Math.abs(curr-prev)/1000/60/60/24)
        if (diffs[diff] === undefined) diffs[diff] = 0
        diffs[diff]++
        prev = curr;
    }
    const sortedDiffs = Object.keys(diffs).sort((a,b)=>diffs[b]-diffs[a]);
    const updateFreq = sortedDiffs[0];
    const misses = sortedDiffs.splice(1).reduce((a,v)=>v > updateFreq ? a+diffs[v] : a,0)
    const onTimeRate = (((updates-misses) / updates)*100).toFixed(1)
    return {
        updateFreq,
        misses,
        totalListenTime,
        onTimeRate,
        updates
    }
}
function htmlCollectionToArray(items) {
    return new Array(items.length).fill(0).map((_,i)=>items[i]);
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

function get(e,field) {
    return e.getElementsByTagName(field)[0];
}

function range(i) {
    return new Array(i).fill(0).map((x,i)=>i);
}
var vm = new Vue({
    el: '#app',
    data: {
        rssLink: "",
        rssDoc: null,
        status: "IDLE",
        items: null,
        stats: null,
        title: null,
        cuStart: 1,
        cuRate: 2,
        cuErr: false
    },
    computed: {
        cuResult() {
            if(!this.stats) return "?";
            this.cuErr = false;
            const l_rate = parseInt(this.cuRate);
            const start_ep = parseInt(this.cuStart);
            const r_rate = 7/this.stats.updateFreq;
            const start_week = this.stats.updates;
            if (l_rate > 24*7) {
                this.cuErr = true;
                return "That's more then a episode every hour every day!";
            }
            if (l_rate < 1) {
                this.cuErr = true;
                return "You gotta listen to at least 1 episode a week";
            }
            if (start_ep < 1) {
                this.cuErr = true;
                return "How you gonna start at a episode before episode 1 mr.user";
            }
            if (start_ep > this.stats.updates){
                this.cuErr = true;
                return "How you gonna start at a episode after the latest episode mr.user";
            }    
            return cu_math(l_rate, r_rate, start_week, start_ep);
        }
    },
    methods: {
        loadFeed() {
            this.status = "LOADING";
            getRSSFeed(this.rssLink)
            .then(r=>{
                this.rssDoc = r;
                const items = r.getElementsByTagName("item");
                this.items = htmlCollectionToArray(items)
                this.title = r.getElementsByTagName("title")[0].innerHTML;
                this.stats = calculateStats(htmlCollectionToArray(items));
                this.status = "COMPLETE";
            })
        },
        get(e,field) {
            return e.getElementsByTagName(field)[0].innerHTML;
        },
        clean(t) {
            return t.replace(/]]>$/,"").replace("<![CDATA[","");
        },
        toLocalTime(d) {
            d = new Date(d);
            date = d.toDateString();
            time = d.toLocaleTimeString('en-US');
            time = time.replace(/(\d+):(\d+):(\d+)/,"$1:$2");
            return `${time} ${date}`;
        },
        listen(item) {
            const e = item.getElementsByTagName("enclosure")[0]
            const attrs = new Array(e.attributes.length).fill(0).map((x,i)=>e.attributes[i]);
            const link = attrs.filter((x)=>x.name === "url")[0].value;
            const fake = document.createElement("a");
            fake.target = "_blank";
            fake.href = link;
            fake.style.display = "none";
            document.body.appendChild(fake);
            fake.click();
            document.body.removeChild(fake);
        }
    }
})
