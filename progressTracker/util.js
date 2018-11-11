function $(id){
  return document.getElementById(id);
}

function node(tag, root) {
  const e = document.createElement(tag);
  for(let k of Object.keys(root))
    e[k] = root[k];
  return {
    dom: e,
    style: function(o) {
      for(let k of Object.keys(o))
        this.dom.style[k] = o[k];
      return this;
    },
    attrs: function(o) {
      for(let k of Object.keys(o))
        e.setAttribute(k,o[k]);
      return this;
    },
    add: function(e) {
      this.dom.appendChild(e.dom);
    }
  }
}

function flash(e,d) {
  e.classList.add("on");
  setTimeout(()=>e.classList.remove("on"),d);
}

export {$,node,flash}
