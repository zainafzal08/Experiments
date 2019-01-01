
function parseXML(s) {
    parser = new DOMParser();
    return parser.parseFromString(s,"text/xml").getElementsByTagName("item");
}
function getRSSFeed(link) {
    return fetch(link)
        .then(r=>r.text())
        .then(r=>parseXML(r))
}

window.onload = function () {
    let test = "http://rosebuddies.libsyn.com/rss";
    //getRSSFeed(test)
    //    .then(r=>console.log(r))
}