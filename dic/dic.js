function partyTime() {
  // image
  const url = new URL(window.location.href);
  const img_url = url.searchParams.get("img");
  const blur = url.searchParams.get("blur");
  const b = document.getElementById('background');
  b.style['background-image'] = `url(${img_url})`;
  b.style['filter'] = `blur(${blur}px)`;
  b.style.top = `-${blur}px`
  b.style.left = `-${blur}px`
  b.style.width = `calc(100vw + 2 * ${blur}px)`;
  b.style.height = `calc(100vh + 2 * ${blur}px)`;

  // text
  const t = document.getElementById("text");
  const st = document.getElementById("subtext");
  t.style["font-family"] = url.searchParams.get("font");
  t.innerHTML = url.searchParams.get("text");
  const s =url.searchParams.get("shadow");
  t.style["text-shadow"] = `${s}px ${s}px black`;
  st.style["font-family"] = url.searchParams.get("font");
  st.innerHTML = url.searchParams.get("subtext");
}

window.onload = partyTime;
