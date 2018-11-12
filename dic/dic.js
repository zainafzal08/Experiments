function $(id) {
  return document.getElementById(id);
}

function partyTime() {
  // image
  let url = new URL(window.location.href);
  url = url.searchParams;
  for(let i of url) console.log(i);
  const img_url = url.get("img");
  const blur = url.get("blur");
  const b = document.getElementById('background');
  b.style['background-image'] = `url(${img_url})`;
  b.style['filter'] = `blur(${blur}px)`;
  b.style.top = `-${blur}px`
  b.style.left = `-${blur}px`
  b.style.width = `calc(100vw + 2 * ${blur}px)`;
  b.style.height = `calc(100vh + 2 * ${blur}px)`;
  $('darknessFilter').style.opacity = url.get("darkness");
  // text
  const t = document.getElementById("text");
  const st = document.getElementById("subtext");
  t.style["font-family"] = url.get("font");
  t.innerHTML = url.get("text");
  const s =url.get("shadow");
  t.style["text-shadow"] = `${s}px ${s}px black`;
  t.style["color"] = `#${url.get("textColor")}`;
  st.style["font-family"] = url.get("font");
  st.innerHTML = url.get("subtext");
  st.style["color"] = `#${url.get("subtextColor")}`;
}

window.onload = partyTime;
