/*
 * Stolen from
 * https://stackoverflow.com/questions/5736398/how-to-calculate-the-svg-path-for-an-arc-of-a-circle
 */
function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  var angleInRadians = (angleInDegrees-90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
}

function describeArc(x, y, radius, startAngle, endAngle){

    var start = polarToCartesian(x, y, radius, endAngle);
    var end = polarToCartesian(x, y, radius, startAngle);

    var largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";

    var d = [
        "M", start.x, start.y,
        "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y
    ].join(" ");

    return d;
}

function rgb(c) {
  return {
    red: parseInt(c.substr(1,2),16),
    green: parseInt(c.substr(3,2),16),
    blue: parseInt(c.substr(5,2),16)
  }
}
function linearInterp(f,c1,c2) {
  c1 = rgb(c1)
  c2 = rgb(c2)
  let r = {
    red: c1.red + f*(c2.red - c1.red),
    green: c1.green + f*(c2.green - c1.green),
    blue: c1.blue + f*(c2.blue - c1.blue)
  }
  return `rgb(${r.red},${r.green},${r.blue})`;
}

function gradient(f,colors) {
  const [c1,c2,c3,c4] = colors;
  if(c3 == undefined) return linearInterp(f,c1,c2);
  f = f * 3;
  if (f <= 1) return linearInterp(f,c1,c2);
  if (f <= 2) return linearInterp(f-1,c2,c3);
  if (f <= 3) return linearInterp(f-2,c3,c4);
}

export class App {
  constructor(rootId) {
    this.root = document.getElementById(rootId);
    this.time = "14:00";
    this.parsedTime = this.parseTime("14:00");
    this.arcs = [];
    this.startTime = null;
    this.running = false;
    this.end = null;
    this.initArcs();
    this.interval = null;
    window.addEventListener("keydown",(e)=>{
      if(e.key == " " && this.running) this.pause();
      else if(e.key == " " && !this.running) this.start();
    })
    this.colors = [
      "#00cdac",
      "#8ddad5",
      "#f4d03f",
      "#fe5196"
    ];
  }
  makeElem(tag,attrs){
    const e = document.createElement(tag);
    for (let key of Object.keys(attrs)) {
      e.setAttribute(key,attrs[key]);
    }
    return e
  }
  initArcs() {
    this.arcs.push({
        fill: "none",
        "stroke-width": "2",
        stroke: "#00D9C0",
        id: "1"
    });
    this.arcs.push({
        fill: "none",
        "stroke-width": "2",
        stroke: "#EBEBEB",
        d: describeArc(50, 50, 40, 0, 359),
        id: "2"
    });
    this.arcs.push({
        fill: "none",
        "stroke-width": "2",
        stroke: "#EBEBEB",
        d: describeArc(50, 50, 40, 359, 360),
        id: "3"
    });
  }
  start() {
    if(this.parsedTime === null) return;
    this.running = true;
    const now = new Date();
    this.startTime = now;
    this.end = new Date(now.getTime() + this.parsedTime*1000);
    this.interval = window.setInterval(()=>this.tick(),5);
    this.total = this.parsedTime;
    this.renderCycle();
  }
  tick() {
    const now = new Date();
    this.parsedTime = Math.ceil((this.end.getTime()-now.getTime())/1000);
    if (this.parsedTime <= 0){
      this.stop();
      return
    }
    const passed = (now.getTime() - this.startTime.getTime());
    const total = (this.end.getTime() - this.startTime.getTime());
    const percentageDone = (passed/total);
    const segment = percentageDone*359;
    this.arcs[0].stroke = gradient(percentageDone,this.colors);
    this.arcs[0].d = describeArc(50, 50, 40, 0, segment);
    this.arcs[1].d = describeArc(50, 50, 40, segment, 359);
    this.renderCycle()
  }
  renderCycle() {
    document.getElementById("clock").value = this.strTime(this.parsedTime);
    for(let arc of this.arcs)
      for(let attr of Object.keys(arc))
        document.getElementById(arc.id).setAttribute(attr,arc[attr])
  }
  pause() {
    this.running = false;
    window.clearInterval(this.interval);
  }
  stop() {
    this.running = false;
    window.clearInterval(this.interval);
    this.startTime = null;
    this.interval = null;
    this.parsedTime = this.total;
    this.time = this.strTime(this.parsedTime);
    this.arcs[0].d = describeArc(50, 50, 40, 0, 0);
    this.arcs[0].stroke = this.colors["green"];
    this.arcs[1].d = describeArc(50, 50, 40, 0, 359);
    this.renderCycle();
    document.body.classList.remove("flash");
    document.body.classList.add("flash");
  }
  renderSVG() {
    const svg = this.makeElem("svg",{
      "viewBox": "0 0 100 100"
    })
    for(let arc of this.arcs)
      svg.appendChild(this.makeElem("path",arc));
    return svg;
  }
  renderClock() {
    const container = document.createElement("div");
    container.className = "face center";
    this.clock = this.makeElem("input",{
      maxlength: 8,
      value: this.strTime(this.parsedTime),
      placeholder: "14:00"
    })
    this.clock.id = "clock";
    this.clock.className = "simple";
    container.appendChild(this.renderSVG());
    container.appendChild(this.clock);
    return container;
  }
  helpMsg() {
    const p = document.createElement("p");
    p.innerText = "Press Space To Start/Stop";
    return p;
  }
  parseTime(s) {
    let components = s.split(":");
    let hours,minutes,seconds;
    if(components.length == 1) {
      seconds = components[0];
      hours = 0;
      minutes = 0;
    } else if(components.length == 2) {
      [minutes,seconds] = components;
      hours = 0;
    } else if (components.length == 3) {
      [hours,minutes,seconds] = components;
    } else return null;
    try {
      seconds = parseInt(hours)*60*60 + parseInt(minutes)*60 + parseInt(seconds);
    } catch {
      return null;
    }
    if (!seconds && seconds !== 0) return null;
    return seconds;
  }
  strTime(s){
    let hours = Math.floor(s/3600);
    let minutes = Math.floor((s%3600)/60);
    let seconds = s%60;
    if (hours < 10) hours = "0"+hours;
    if (minutes < 10) minutes = "0"+minutes;
    if (seconds < 10) seconds = "0"+seconds;
    if(hours > 0)
      return `${hours}:${minutes}:${seconds}`
    else if (minutes > 0)
      return `${minutes}:${seconds}`
      else
        return `${seconds}s`
  }
  updateClock(e){
    document.getElementById("clock").classList.remove("invalid");
    this.time = e.target.value;
    this.parsedTime = this.parseTime(e.target.value);
    if(this.parsedTime === null)
      document.getElementById("clock").classList.add("invalid");
  }
  render() {
    const container = document.createElement("div");
    container.className = "container center row cover col";
    container.appendChild(this.renderClock());
    container.appendChild(this.helpMsg());
    this.root.innerHTML = "";
    this.root.appendChild(container);
    this.root.innerHTML += " ";
    document.getElementById("clock").addEventListener("input",(e)=>this.updateClock(e))
  }
}
