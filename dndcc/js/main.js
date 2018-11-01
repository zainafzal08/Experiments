window.addEventListener('load', init);

page = {
  title: "Pick a Race for"
};
races = [
  {
    name: "Dwarf",
    tagLine: "Short, Stout And Can Take A Hit",
    physical: {
      height: "4-5 ft",
      size: "Medium",
      speed: "25 ft"
    },
    subraces: {
      "Mountain Dwarf": {

      },
      "Hill Dwarf": {

      }
    },
    features: {
      "Ability": {
        fullName: "Ability Score",
        desc: "+2 To Constitution",
        icon: "plus-one"
      },
      "Darkvision": {
        fullName: "Darkvision",
        desc: "You can see in dim light within 60 feet",
        icon: "eye-circle"
      },
      "Resilience": {
        fullName: "Dwarven Resilience",
        desc: "Advantage on saving throws against poison, resistance against poison damage",
        icon: "shield"
      },
      "Combat": {
        fullName: "Dwarven Combat Training",
        desc: "proficiency with the battleaxe, handaxe, throwing hammer, and warhammer.",
        icon: "sword-cross"
      },
      "Tools": {
        fullName: "Tool Proficiency",
        desc: "proficiency with the artisan's tools of your choice: smith's tooLs, brewer's supplies, or mason's tools.",
        icon: "hammer"
      },
      "Stone": {
        fullName: "Stonecunning",
        desc: "Whenever you make an Intelligence (History) check related to the origin of stonework, you are considered proficient in the History skill and add double your proficiency bonus to the check, instead of your normal proficiency bonus.",
        icon: "diamond-stone"
      },
      "Languages": {
        fullName: "Languages",
        desc: "You can speak, read, and write Common and Dwarvish. Dwarvish is full of hard consonants and guttural sounds, and those characteristics spill over into whatever other language a dwarf might speak.",
        icon: "web"
      }
    }
  },
  {
    name: "Dragonborn",
    tagLine: ""
  },
  {
    name: "Elf",
    tagLine: ""
  },
  {name: "Gnome"},
  {name: "Half-Elf"},
  {name: "Half-Orc"},
  {name: "Halfling"},
  {name: "Human"},
  {name: "Tiefling"}
];

character = {};

function elem(tag,className,options) {
  const elem = document.createElement(tag);
  elem.className = className;
  if(!options) options = {};
  for(let key of Object.keys(options)) {
    elem[key] = options[key];
  }
  return elem
}

function desc(k, v) {
  const e = elem("div","desc-pair");
  e.appendChild(elem("b","",{innerText: k}));
  e.appendChild(elem("span","",{innerText: v}));
  return e;
}

function elevate(node, className) {
  while (!node.classList.contains(className)) node = node.parentNode;
  return node;
}
function clearTabs(node) {
    node = elevate(node,"tab");
    node = node.parentNode;
    for (let tab of node.children)
      tab.classList.remove("active");
}

function getFeatures(items) {
  const features = elem("div","features");
  const tabs = elem("div","tabs");
  let tab;
  const firstKey = Object.keys(items)[0];
  for (let k of Object.keys(items)) {
    tab = elem("div","tab");
    tab.appendChild(elem("i",`mdi mdi-${items[k].icon}`));
    tab.addEventListener("click",(e)=>{
      clearTabs(e.target);
      elevate(e.target,"tab").classList.add("active");
      const content = elevate(e.target,"features").querySelector(".tab-content");
      content.innerHTML = "";
      content.appendChild(elem("h3","",{innerHTML: items[k].fullName}))
      content.appendChild(elem("p","",{innerHTML: items[k].desc}))
    })
    tabs.appendChild(tab);
  }
  tabs.children[0].classList.add("active");
  const tabContent = elem("div","tab-content");
  tabContent.appendChild(elem("h3","",{innerHTML: items[firstKey].fullName}))
  tabContent.appendChild(elem("p","",{innerHTML: items[firstKey].desc}))
  features.appendChild(tabs);
  features.appendChild(tabContent);
  return features;
}

function makeRaceCard(c) {
  const e = elem("div","card");
  e.appendChild(elem("h2","",{innerText: c.name}));
  e.appendChild(elem("h4","",{innerText: c.tagLine}));
  e.appendChild(elem("hr",""));

  const physical = elem("div","physical");
  physical.appendChild(desc("Height",c.physical.height))
  physical.appendChild(desc("Size",c.physical.size))
  physical.appendChild(desc("Speed",c.physical.speed))
  e.appendChild(physical);
  e.appendChild(getFeatures(c.features));
  return e;
}

// TODO: Wire in Hodge Podge
function randomName() {
    return "Anayltica The Brave";
}

function init() {
  document.querySelector("header input").value = randomName();
  document.querySelector("header span").innerText = page.title;
  const root = document.querySelector("main .cards");
  for(let race of races)
    root.appendChild(makeRaceCard(race));
}
