window.onload = init;
import {$} from './tools/util.js'
import Test from './components/Test.js'
const test = new Test();

function init() {
  test.paint("test");
}
