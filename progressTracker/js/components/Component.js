import {$,$e} from '../tools/util.js'

class Component {
  constructor() {
    this.root = null;
    this.children = [];
    this.parser = new DOMParser();
    this.components = {};
  }
  paint(id) {
    $(id).innerHTML = "";
    $(id).appendChild(this.render());
  }
  _set(prop,val) {
    this[prop] = val;
    this.paint();
  }
  parseTemplate() {
    const xmlDoc = this.parser.parseFromString(this.template(),"text/xml")
    this.root = xmlDoc.children[0];
    this.children = this.root.children;
    if (this.root.textContent)
      this.root.textContent = this.root.textContent.replace(/\{\{([^\{\}]+)\}\}/g,(_,exp)=>{
        return eval(exp);
      })
  }
  render() {
    this.parseTemplate()
    for (let e of this.children) {
      if (this.components[e.tagName] !== undefined)
        this.root.appendChild((new this.components[e.tagName]).render());
      else
        this.root.appendChild(e);
    }
    return this.root;
  }
}

export default Component;
