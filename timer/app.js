class Handler {
  constructor() {
    this.callback = null;
  }
  run(callback) {
    this.callback = callback;
  }
}

class BindedElem {
  constructor(domNode) {
    this.dom = domNode
    this.events = {}
  }
  on(event) {
    this.events[event] = Handler();
    this.dom.addEventListener(event,this.vectorTable)
    return this.events[event];
  }
  vectorTable(e) {
    console.log(e);
  }
}

class App {
  constructor() {
    this.running = false;
    this.elems = [];
  }
  bind(elemId) {
    let elem = bindedElem(document.getElementById(elemId))
    this.elems.push(elem);
    return elem;
  }
}

export App;
