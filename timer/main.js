import { App } from './app.js';

window.onload = init;

function init() {
  // init app
  let app = new App("root");
  app.render()
}


function timeToSeconds(s) {
  let components = s.split(":");
  let hours,minutes,seconds;
  if(components.length == 2) {
    [minutes,seconds] = components;
    hours = 0;
  } else if (components.length == 3) {
    [hours,minutes,seconds] = components;
  } else return -1;
  try {
    seconds = parseInt(hours)*60*60 + parseInt(minutes)*60 + parseInt(seconds);
  } catch {
    return -1;
  }
  return seconds;
}


function start() {
  let seconds = timeToSeconds(config.clock.innerText);
  document.getElementById("start-btn").innerText = "Pause";
  if (seconds == -1) {
    document.getElementById("clock").style.borderBottom = "2px solid #FF4365";
    return;
  }
  let now = new Date();
  config.clock.style.borderBottom = "";
  config.startTime = now.getTime()/1000;
  config.totalSeconds = seconds;
  config.secondsLeft = seconds;
  config.interval = setInterval(tick,1000);
}

function pause() {
  clearInterval(config.interval);
  config.toggleBtn.innerText = "Start";
}
function resume() {
  config.interval = setInterval(tick,1000);
  config.toggleBtn.innerText = "Pause";
}
function toggle() {
  config.started = !config.started;
  if (config.started && config.startTime === null) start();
  else if (config.started) resume();
  else pause();
}

function secondsToTime(s) {
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

function renderFace() {
  const clock = document.getElementById("clock");
  clock.innerText = secondsToTime(config.secondsLeft);
}

function renderArc(diff) {
  if (config.percentage > 0.7)
    document.getElementById("arc1").setAttribute("stroke",config.warningColor);
  if (config.percentage > 0.9)
    document.getElementById("arc1").setAttribute("stroke",config.dangerColor);
  if (diff > config.totalSeconds) {
    clearInterval(config.interval);
    document.getElementById("arc1").setAttribute("stroke",config.blankColor);
    return;
  }
  let angle = Math.floor(config.percentage * 359);
  document.getElementById("arc1").setAttribute("d",describeArc(50, 50, 40, 0, angle));
  document.getElementById("arc2").setAttribute("d",describeArc(50, 50, 40, angle, 359));
}
function tick() {
  // update config
  let now = new Date();
  let diff = (now.getTime()/1000) - config.startTime;
  config.percentage = diff/config.totalSeconds;
  config.secondsLeft = Math.ceil(config.totalSeconds - diff);
  // render
  renderFace();
  renderArc(diff);
}

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
