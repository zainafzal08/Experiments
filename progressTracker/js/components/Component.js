import {$,node} from '../tools/util.js'

class Component {
  constructor(id) {
    this.id = id;
    this.children = [];
  }
  paint() {
    $(this.id).innerHTML = "";
    $(this.id).appendChild(this.render());
  }
  _set(prop,val) {
    this[prop] = val;
    this.paint();
  }
}

export default Component;
