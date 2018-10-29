window.onload = init;

colors = {
  blue: "#5CC8FF"
}

function init() {
  let f = makeFlashcard("Who is not throwing away their shot?","Alexander Hamilton!",colors.blue);
  document.getElementById("flashcards").appendChild(f);
  f = makeFlashcard("Who is not throwing away their shot?","Alexander Hamilton!",colors.blue);
  document.getElementById("flashcards").appendChild(f);
  document.getElementById("text").addEventListener("input",compile);
  compile();
}

const READY = 0;
const TOPIC = 1;
const SEP_PRIME = 2;
const QUESTION = 3;
const ANSWER = 4;

function updateState(state, c) {
  if ((state === READY || state === ANSWER) && c === ">") return [true,TOPIC];
  if (state === TOPIC && c === "\n") return [true,QUESTION];
  if (state === QUESTION && c === "\n") return [false,SEP_PRIME];
  if (state === SEP_PRIME && c !== "\n") return [false,QUESTION];
  if (state === SEP_PRIME && c === "\n") return [true,ANSWER];
  return [false,state];
}
function compile() {
  const raw = document.getElementById("text").value;
  let state = READY;
  let skip = false;
  let curr = {
    topic: "",
    question: "",
    answer: ""
  };
  let cards = [];
  for (let c of raw) {
    let prev = state;
    [skip,state] = updateState(state,c);
    if(prev !== TOPIC && state === TOPIC){
      cards.push(curr);
      curr = {
        topic: "",
        question: "",
        answer: ""
      };
    }
    if (skip) continue;
    if (state === TOPIC) curr.topic += c;
    if (state === QUESTION || state === SEP_PRIME) curr.question += c;
    if (state === ANSWER) curr.answer += c;
  }
  cards = cards.splice(1);
  cards.push(curr);
}

function showAnswer(tab,answer, content) {
  tab.classList.toggle("shown");
  tab.children[0].classList.toggle("flip");
  answer.classList.toggle("shown");
  content.classList.toggle("shown");
}

function elem(tag,className,options) {
  const elem = document.createElement(tag);
  elem.className = className;
  if(!options) options = {};
  for(let key of Object.keys(options)) {
    elem[key] = options[key];
  }
  return elem
}

function makeFlashcard(question, answer, color) {
  const container = elem("div","flashcard");
  const tab = elem("div","tab");
  tab.style.backgroundColor = color;
  tab.addEventListener("click",(e)=>{
      let tab,content;
      tab = e.target;
      if (e.target.tagName === "I") tab = e.target.parentNode;
      showAnswer(tab,tab.parentNode.children[1],tab.parentNode.children[2]);
  });
  tab.appendChild(elem("i","mdi mdi-chevron-right"));
  const answerNode = elem("div","answer");
  answerNode.style.backgroundColor = color;
  const content = elem("div","content");
  answerNode.appendChild(elem("h2","",{innerText: answer}))
  content.appendChild(elem("h2","",{innerText: question}))
  container.appendChild(tab);
  container.appendChild(answerNode);
  container.appendChild(content);
  return container;
}
