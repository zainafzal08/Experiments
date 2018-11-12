import Component from './Component.js'
import {$,node} from '../tools/util.js'

class Test extends Component {
  constructor (id) {
    super(id);
  }
  template() {
    return `
      <div> Hello world! </div>
    `
  }
}

export default Test;
