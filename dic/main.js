let toggleState = false;

window.onload = function() {
  document.getElementById("toggle").addEventListener("click",(e)=>{
    let toggle = e.target.children[0];
    if (toggle === undefined) toggle = e.target;
    if(toggle.classList.contains("toggle-left")) {
      toggleState = true;
      toggle.classList.remove("toggle-left");
      toggle.classList.add("toggle-right");
    } else {
      toggleState = false;
      toggle.classList.remove("toggle-right");
      toggle.classList.add("toggle-left");
    }
    if(toggleState) document.getElementById("underline").style.display = "";
    else document.getElementById("underline").style.display = "none";
  });
}

function randomImage() {
  fetch("https://source.unsplash.com/random")
    .then((r)=>{
      document.getElementById('url').value = r.url;
      document.getElementById('preview').style.backgroundImage = `url(${r.url})`;
    });
  document.getElementById('url').placeholder = "searching...";
}
function updateImage() {
  let url = document.getElementById('url').value;
  document.getElementById('preview').style.backgroundImage = `url(${url})`;
}
function updateBlur() {
  let v = document.getElementById('blur').value;
  document.getElementById('preview').style.filter = `blur(${v}px)`;
}
function updateShadow() {
  let v = document.getElementById('shadow').value;
  document.getElementById('overlay').style['text-shadow'] = `${v}px ${v}px #000`;
}
function updateFont() {
  let v = document.getElementById('font').value;
  document.getElementById('overlay').style['font-family'] = v;
}
function updateOverlay() {
  let v = document.getElementById("top-text").value;
  document.getElementById('overlay').innerText = v;
}
function updateSubtitle() {
  let v = document.getElementById("bottom-text").value;
  document.getElementById('subtitle').innerText = v;
}

function redirect() {
  // font shadow blur url
  let params = {
    "font": document.getElementById('font').value,
    "shadow":  document.getElementById('shadow').value,
    "blur": document.getElementById('blur').value,
    "img": document.getElementById('url').value,
    "text": document.getElementById('top-text').value,
    "subtext": document.getElementById('bottom-text').value,
    "underline": toggleState
  };
  params = Object.keys(params).map((x)=>`${x}=${params[x]}`).join("&");
  let a = document.createElement('a');
  a.style.display = "none";
  a.href = `file:///Users/zain/Desktop/emergency%20memes/DIC_result.html?${params}`
  document.body.appendChild(a);
  a.click();
}
