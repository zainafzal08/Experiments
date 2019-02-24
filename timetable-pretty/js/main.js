let cards = []
let allRows = []

function registerFile(event) {
  let t = event.target
  console.log(t.files[0].json())
  t.parentElement.removeChild(t)
}

function saveData() {
    let now = new Date
    let obj = {}
    obj.time = now.getTime()
    obj.data = []
    for (let r of allRows) {
      r = [r,r,r,r,r,r]
      let row = r.map((x,i)=>traverse(x,[i,0]).value)
      obj.data.push(row)
    }
    let file = new Blob([JSON.stringify(obj)])
    let psudo = document.createElement("a")
    psudo.href = URL.createObjectURL(file)
    psudo.download = obj.time+"_save.json"
    psudo.opacity = 0
    psudo.style.width = "0px"
    psudo.style.height = "0px"
    psudo.click()
}

function loadData(){
  let psudo = document.createElement("input")
  psudo.type = "file"
  psudo.opacity = 0
  psudo.style.width = "0px"
  psudo.style.height = "0px"
  document.body.appendChild(psudo)
  psudo.click()
  psudo.addEventListener("change",registerFile)
}

function traverse(e,j) {
    let curr = e
    for(let i of j) {
      curr = curr.children[i]
    }
    return curr
}

function addRow(){
  let last = document.getElementById("last")
  let clone = last.cloneNode(true)
  last.id = ""
  clone.id = "last"
  let rows = document.getElementById("rows")
  rows.appendChild(clone)
  unbindEvents(last)
  bindEvents(clone)
  allRows.push(clone);
}

function updateColor(event){
    let e = traverse(event.target.parentNode,[1,0])
    e.style.backgroundColor = event.target.value
}

function formHeading(t,fs) {
  let heading = document.createElement("h3")
  heading.className = "display-3"
  heading.style.fontSize = fs
  heading.appendChild(document.createTextNode(t))
  heading.style.margin = "0rem"
  return heading
}

function formSubHeading(t,c,fs) {
  let heading = document.createElement("p")
  heading.className = "lead"
  heading.style.color = c
  heading.style.fontSize = fs
  heading.appendChild(document.createTextNode(t))
  heading.style.margin = "0rem"
  return heading
}

function formDetails(t,fs){
  let details = document.createElement("p")
  details.style.fontFamily = '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"'
  details.style.fontSize = fs
  details.style.color = "#BBB"
  details.appendChild(document.createTextNode(t))
  return details
}

function getPos(el) {
    for (var lx=0, ly=0;
         el != null;
         lx += el.offsetLeft, ly += el.offsetTop, el = el.offsetParent);
    return {x: lx,y: ly};
}

function formCard(width, height,topShift, leftShift, color) {
  let card = document.createElement("div")
  card.style.height = (height-0.5)+"rem"
  card.style.width = width
  card.style.position = "absolute"
  card.style.top = topShift
  card.style.left = leftShift
  card.style.boxShadow = "0 3px 6px rgba(0,0,0,0.16), 0 3px 6px rgba(0,0,0,0.23)"
  card.style.borderRadius = "15px"
  card.style.borderTop = "20px "+color+" solid"
  card.style.textAlign = "center"
  card.style.display = "flex"
  card.style.alignItems = "center"
  card.style.justifyContent = "center"
  return card
}

function placeEvent(start,end,color,h,sh,d) {
    let anchor = getPos(document.getElementById("anchor-1"))
    let l = parseInt(end) - parseInt(start.split("-")[0])
    l = 3.5*l

    let widthAnchor = document.getElementById("anchor-"+parseInt(start.split("-")[1]))
    leftShift = widthAnchor.getBoundingClientRect().left+"px"

    let topShift = 3.5*(parseInt(start.split("-")[0]-9))
    topShift = "calc("+(anchor.y)+"px + "+topShift+"rem)"

    let card = formCard("14%",l,topShift,leftShift,color)

    let heading;
    let subHeading;
    let details;
    if(l == 3.5) {
      heading = formHeading(h,"0.8rem")
      subHeading = formSubHeading(sh,color,"0.6rem")
      details = formDetails(d,"0.5rem")
      heading.style.color = "white"
      heading.style.marginTop = "-0.2rem"
    }
    else {
      heading = formHeading(h,"1.5rem")
      subHeading = formSubHeading(sh,color,"1rem")
      details = formDetails(d,"0.8rem")
    }

    let content = document.createElement("div")
    content.appendChild(heading)
    if(subHeading)
      content.appendChild(subHeading)
    content.appendChild(details)
    card.appendChild(content)
    cards.push(card)
    document.body.appendChild(card)
}

function clearTimetable(){
  for(let e of cards) {
    e.parentNode.removeChild(e)
  }
  cards = []
}

function updateTimetable(data) {
  // clear
  clearTimetable()
  // place
  for(let r of data) {
    placeEvent(r[3],r[4],r[0],r[1],r[2],r[5])
  }
}

function dayValid(d) {
  if (!d) return false
  if (d < 1 || d > 5) return false
  return true
}

function timeValid(t) {
  if (!t) return false
  if (t < 9 || t > 18) return false
  return true
}

function humanToDay(s) {
  let d = null
  if(/mon/.test(s)) d = 1
  else if(/tue/.test(s)) d = 2
  else if(/wed/.test(s)) d = 3
  else if(/thu/.test(s)) d = 4
  else if(/fri/.test(s)) d = 5
  if(dayValid(d)) return d
  return null
}

function humanToTime(s) {
  let t = null

  if(/(\d+)am/.test(s)) t = parseInt(/(\d+)am/.exec(s)[1])
  else if(/(\d+)pm/.test(s)) {
    t = parseInt(/(\d+)pm/.exec(s)[1])
    if(t!=12) t+=12
  }
  else if(/(\d+)/.test(s)) t = parseInt(/(\d+)/.exec(s)[1])
  if (timeValid(t)) return t
  return null
}

function humanToDatetime(s) {
    s = s.toLowerCase()
    let d = humanToDay(s)
    let t = humanToTime(s)
    if(d && t) return t+"-"+d
    return null
}

function processData() {
  let data = []
  for(let r of allRows) {
    r = [r,r,r,r,r,r]
    let row = r.map((x,i)=>traverse(x,[i,0]).value)
    row[3] = humanToDatetime(row[3])
    row[4] = humanToTime(row[4])
    let valid = row.reduce((a,v)=> a&&(v!="" && v))
    if (!valid) continue
    data.push(row)
  }
  updateTimetable(data)
}

function checkDateTime(e) {
    if(humanToDatetime(e.target.value)) {
      e.target.classList.remove("is-invalid")
      e.target.classList.add("is-valid")
    } else {
      e.target.classList.remove("is-valid")
      e.target.classList.add("is-invalid")
    }
}
function checkTime(e) {
    if(humanToTime(e.target.value)) {
      e.target.classList.remove("is-invalid")
      e.target.classList.add("is-valid")
    } else {
      e.target.classList.remove("is-valid")
      e.target.classList.add("is-invalid")
    }
}

function unbindEvents(l) {
  // new row
  for(let i=0;i<6;i++)
    traverse(l,[i,0]).removeEventListener("focus",addRow)
}

function bindEvents(l) {
  // new row
  for(let i=0;i<6;i++)
    traverse(l,[i,0]).addEventListener("focus",addRow)
  // feedback
  traverse(l,[0,0]).addEventListener("change",updateColor)
  traverse(l,[3,0]).addEventListener("change",checkDateTime)
  traverse(l,[4,0]).addEventListener("change",checkTime)
}

function init() {
  let l = document.getElementById("last")
  bindEvents(l)
  allRows.push(l)
  document.getElementById("place").addEventListener("click",processData)
  document.getElementById("save").addEventListener("click",saveData)
  document.getElementById("load").addEventListener("click",loadData)
}

window.onload = init
