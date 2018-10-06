window.onload = init;

game= {
  factors: [],
  focus: 0,
  won: false,
  points: 0
}


function truncate(s,i) {
  return s.substr(0,s.length-i);
}

function init() {
  window.addEventListener("keydown",(e)=>{
    let d = document.getElementById("drop");
    d.classList.remove("dropped");
    if (e.key === "Backspace")
      d.innerText = truncate(d.innerText,1);
    if (e.key === "Enter")
      execute()
    if (e.key === "ArrowLeft" && game.focus > 0){
      game.focus--;
      render();
    }
    if (e.key === "ArrowRight" && game.focus < game.factors.length-1){
      game.focus++;
      render();
    }
    else if(e.key.match(/[0-9]+/))
      d.innerText += e.key;

  })
  let gv = Math.ceil(Math.random()*100);
  while(isPrime(gv) || gv == 1) gv = Math.ceil(Math.random()*100);
  game.factors.push(gv);
  game.stage = document.getElementById("stage");
  game.drop = document.getElementById("drop");
  game.historyElem = document.getElementById("history");
  game.pointsElem = document.getElementById("points");
  render();
}

function shake() {
  game.stage.classList.add("shake");
  window.setTimeout(()=>game.stage.classList.remove("shake"),0.2*1000);
}

function isPrime(input) {
    let prime = true;
    for (let i = 2; i <= Math.sqrt(input); i++) {
        if (input % i == 0) {
            prime = false;
            break;
        }
    }
    return prime && (input > 1);
}

function register() {
  let f = parseInt(game.drop.innerText);
  let v = game.factors[game.focus];

  if (v % f == 0 && v != f && f != 1) {
    let left = game.factors.splice(0,game.focus);
    let right = game.factors.splice(game.focus+1);
    game.factors = left.concat([f,v/f]).concat(right);
    console.log(game.factors);
    if (game.factors.filter((x)=>!isPrime(x)).length == 0) game.won = true;
    render();
  } else {
    shake();
  }
}

function execute() {
  document.getElementById("drop").classList.add("dropped");
  window.setTimeout(()=>document.getElementById("drop").innerText = "",0.3*1000)
  window.setTimeout(register,0.2*1000)
}

function reset() {
  let p = document.createElement("p");
  p.innerHTML = game.factors.join(" x ");  
  p.innerHTML += " = "+ game.factors.reduce((a,x)=>a*x,1)
  game.historyElem.prepend(p);
  game.points += game.factors.splice(0,game.factors.length-1).reduce((a,x)=>a+10*x,0)
  game.focus = 0;
  game.factors = [];
  let gv = Math.ceil(Math.random()*1000);
  while(isPrime(gv) || gv == 1) gv = Math.ceil(Math.random()*100);
  game.factors.push(gv);
  game.won = false;
}

function render() {
  if (game.won) reset();
  game.stage.innerHTML = game.factors.map((x,i)=>`<span ${i==game.focus?'class="focus"'  : ''}>${x}</span>`).join("<span> x </span>");  
  game.pointsElem.innerText = game.points;
}
