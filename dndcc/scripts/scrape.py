import requests
from bs4 import BeautifulSoup
import json 
import re 

def walk(root,target):
	while root.name != target:
		root = root.next_sibling
	return root

def walkUntil(root,target,exit):
	while root.name != target:
		root = root.next_sibling
		if (root == None or root.name == exit):
			return None
	return root

base = "http://gdnd.wikidot.com/race:"
ignore = ["Age","Alignment","Size","Speed"]
with open("templates.json","r") as f:
	templates = json.load(f)

iconMap = {
	"Ability Score Increase": "plus-one",
	"Darkvision": "eye-circle",
	"Dwarven Resilience": "heart-half-full",
	"Dwarven Combat Training": "sword-cross",
	"Tool Proficiency": "hammer",
	"Stonecunning": "diamond-stone",
	"Languages": "web",
	"Keen Senses": "eye-plus",
	"Fey Ancestry": "account-alert",
	"Trance": "sleep",
	"Dwarven Toughness": "boxing-glove",
	"Dwarven Armor Training": "shield-outline",
	"Elf Weapon Training": "sword-cross",
	"Cantrip": "auto-fix",
	"Extra Language": "language",
	"Fleet of Foot": "run-fast",
	"Mask of the Wild": "eye-off-outline",
	"Superior Darkvision": "eye-plus",
	"Sunlight Sensitivity": "white-balance-sunny",
	"Drow Magic": "auto-fix",
	"Drow Weapon Training": "sword-cross",
	"Lucky": "dice-multiple",
	"Brave": "karate",
	"Nimble": "feather",
	"Naturally Stealthy": "eye-off-outline",
	"Stout Resilience": "heart-half-full",
	"Draconic Ancestry": "fire",
	"Gnome Cunning": "brain",
	"Natural Illusionist": "eye-settings-outline",
	"Speak with Small Beasts": "voice",
	"Artificer's Lore": "book-open-page-variant",
	"Tinker": "android-studio",
	"Stone Camouflage": "eye-off-outline",
	"Skill Versatility": "account-plus",
	"Menacing": "comment-alert",
	"Relentless Endurance": "sheild-account",
	"Savage Attacks": "knife-military",
	"Hellish Resistance": "shield-plus",
	"Infernal Legacy": "auto-fix",
	"Devil's Tongue": "message-processing",
	"Hellfire": "fire",
	"Winged": "bat"
}
mispellings = {
	"Dwarven Resilienee": "Dwarven Resilience",
	"Ability Score lncrease": "Ability Score Increase",
	"Ability Score Increases": "Ability Score Increase"
}
override = {
	"Draconic Ancestry": "You are distantly related to a particular kind of dragon. Choose a type of dragon from the table available here: http://gdnd.wikidot.com/race:dragonborn"
}
def extractFeatures(dom):
	features = []
	for child in dom:
		key = child.find("strong")
		if(key == -1):
			continue
		key = key.string
		key = re.sub(r"\.\s*$","",key)
		if key in ignore:
			continue
		if key in mispellings:
			key = mispellings[key]
		feature = {}
		feature["fullName"] = key
		desc = "".join(map(lambda x: str(x),list(child.children)[1:]))
		desc = re.sub(r"<[^<>]*>","",desc)
		desc = re.sub(r"^\s*\.\s*","",desc)
		desc = re.sub(r"\n","<br>",desc)
		feature["desc"] = re.sub(r"^\s*:","",desc).strip()
		if key in override:
			feature["desc"] = override[key]
		try:
			feature["icon"] = iconMap[key]
		except:
			print("Missing Icon for {}: {}".format(key,feature["desc"]))
			
		features.append(feature)
	return features

for template in templates:
	print(template["name"].lower())
	race = template["name"].lower()
	template["subraces"] = []
	r = requests.get(base+race)
	soup = BeautifulSoup(r.text, 'html.parser')
	e = walk(soup.find("h1",id="toc0"),"ul")

	template["features"] = extractFeatures(e.children)
	subrace = walkUntil(e.next_sibling,"h4","hr")
	while subrace != None:
		if "Variants" != subrace.string:
			features = extractFeatures(walk(subrace,"ul").children)
			template["subraces"].append({"fullName": " ".join(map(lambda word: word.capitalize(),subrace.string.split(" "))),"features": features})
		subrace = walkUntil(subrace.next_sibling,"h4","hr")



with open("output.json","w") as f:
	json.dump(templates,f,indent=4, separators=(',', ': '), ensure_ascii=False)


