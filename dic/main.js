let toggleState = false;

function $(id) {
  return document.getElementById(id);
}
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
  document.getElementById("top-color").value = "#444444";
  document.getElementById("bottom-color").value = "#777777";
  updateColor("top-color");
  updateColor("bottom-color");
}

// THIS IS SO UGLY BUT I DON'T WANT TO REFACTOR
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
function updateColor(id) {
  let e = document.getElementById(id);
  e.parentNode.style.backgroundColor = e.value;
  updatePreview();
}
function updatePreview() {
  $("overlay").style.color = $("top-color").value;
  $("subtitle").style.color = $("bottom-color").value;
}
function updateDarkness() {
  let v = $('darkness').value;
  $('preview-cover').style.opacity = v/100;
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
    "underline": toggleState,
    "textColor": document.getElementById('top-color').value.substr(1),
    "subtextColor": document.getElementById('bottom-color').value.substr(1),
    "darkness": document.getElementById('darkness').value/100,
  };
  params = Object.keys(params).map((x)=>`${x}=${params[x]}`).join("&");
  let a = document.createElement('a');
  a.style.display = "none";
  a.href = `DIC_result.html?${params}`
  document.body.appendChild(a);
  a.click();
}
