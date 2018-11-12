window.onload = init;
import {$,node} from './tools/util.js'
import Test from './components/Test.js'
const test = new Test("sidebar");

function init() {
  //$("numerical-trigger").addEventListener("click",()=>sidebar.type="numerical");
  //$("item-trigger").addEventListener("click",()=>sidebar.type="item");

  $("numerical-trigger").addEventListener("click",()=>test.paint());
}
