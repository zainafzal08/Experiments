window.onload = init;


function init() {
  for (let e of document.querySelectorAll(".flashcard .tab"))
    e.addEventListener("click",(e)=>{
      let tab,content;
      tab = e.target;
      if (e.target.tagName === "I") tab = e.target.parentNode;
      showAnswer(tab,tab.parentNode.children[1],tab.parentNode.children[2]);
    });
}

function showAnswer(tab,answer, content) {
  tab.classList.toggle("shown");
  tab.children[0].classList.toggle("flip");
  answer.classList.toggle("shown");
  content.classList.toggle("shown");
}
