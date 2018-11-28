import Component from './Component.js'
import Red from './Red.js'

class Test extends Component {
  constructor (id) {
    super(id);
    this.msg = "Hello";
    this.msg2 = "World";
    this.components["Red"] = Red;
  }
  template() {
    return `
      <div> {{this.msg}} <Red>{{this.msg2}}</Red> </div>
    `
  }
}

export default Test;
