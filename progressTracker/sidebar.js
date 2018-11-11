import {$,node,flash} from './util.js'

class _sidebar {
  constructor() {
    this.id = "sidebar";
    this.numericalCount = 0;
    this.numericalTotal = 10;
    this.painted = false;
    this.dyanamicElems = {};
  }
  paint() {
    if(this.painted) {
      for (let k of Object.keys(this.dyanamicElems))
        this.dyanamicElems[k].call(this,document.getElementById(k));
      return;
    }
    this.painted = true;
    $(this.id).innerHTML = "";
    $(this.id).appendChild(this[this.type]());
  }
  icon(t) {
    const e = node("div", {className: "icon-container"});
    e.add(node("i", {
      className: "material-icons noselect",
      innerText: t
    }));
    e.add(node("div",{className: "ripple"}));
    return e;
  }
  _set(prop,val) {
    this[prop] = val;
    this.paint();
  }
  dynamic(id,f) {
    this.dyanamicElems[id] = f;
  }
  numerical() {
    const e = node("div", {className: "numerical-container"});;
    const up = this.icon("expand_less");
    const down = this.icon("expand_more");
    up.dom.addEventListener("click",(e)=>{
      if(e.target.tagName != "I") return;
      flash(e.target.parentNode.querySelector(".ripple"),300);
      if(this.numericalCount === this.numericalTotal) return;
      this._set("numericalCount",this.numericalCount + 1);
      event.stopPropagation();
    });
    down.dom.addEventListener("click",(e)=>{
      if(e.target.tagName != "I") return;
      flash(e.target.parentNode.querySelector(".ripple"),300);
      if(this.numericalCount === 0) return;
      this._set("numericalCount",this.numericalCount - 1);
      event.stopPropagation();
    });
    e.add(up);
    e.add(node("div", {id:"numerical_total",className: "total", innerHTML: `${this.numericalCount}/${this.numericalTotal}`}));
    this.dynamic("numerical_total",(e)=>e.innerText = `${this.numericalCount}/${this.numericalTotal}`);
    e.add(down);
    return e.dom;
  }
}


function Sidebar() {
 const sidebar = new _sidebar();
 const handler = {
    set: function(obj, prop, val) {
        obj._set(prop,val);
        return true;
    }
  };
 return new Proxy(sidebar, handler);
}

export default Sidebar;
