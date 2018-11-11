window.onload = init;
import {$,node} from './util.js'
import Sidebar from './sidebar.js'
const sidebar = Sidebar();

function init() {
  $("numerical-trigger").addEventListener("click",()=>sidebar.type="numerical");
  $("item-trigger").addEventListener("click",()=>sidebar.type="item");
}
