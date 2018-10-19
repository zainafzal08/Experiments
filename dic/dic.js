function partyTime() {
  let centerX = (document.body.clientWidth/2);
  let centerY = (document.body.clientHeight/2);
  const tb = document.getElementById("textbox");
  br = tb.getBoundingClientRect();
  tb.style.left = (centerX-(br.width/2))+"px";
  tb.style.top = (centerY-(br.height/2))+"px";


  function beginClick(e) {
    e.preventDefault()
    // these fuck up if u click on the svg
    // because the svg has a smaller offset.
    // same with the text
    const startX = e.offsetX
    const startY = e.offsetY

    function holding(e) {
      tb.style.left = e.x - startX + 'px';
      tb.style.top =  e.y - startY + 'px';
    }

    function dropped(e) {
      document.body.removeEventListener('mousemove', holding)
      document.body.removeEventListener('mouseup', dropped)
    }

    document.body.addEventListener('mousemove', holding)
    document.body.addEventListener('mouseup', dropped)

  }

  tb.addEventListener('mousedown', beginClick);


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
