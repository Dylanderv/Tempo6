function run() {
  let mobsRaw = document.getElementsByClassName("row");
  let mobs = [];
  for(let i = 100; i <= mobsRaw.length; i++) {
    if (mobsRaw[i]) {
      mobs.push(extractFromMob(mobsRaw[i]));
    }
  }
  console.log(JSON.stringify(mobs));
}

function extractFromMob(mob) {
  let currentMob = {}
  // console.log("extract", mob.getElementsByClassName("title")[0].innerText);
  currentMob.name = processName(mob.getElementsByClassName("title")[0].innerHTML);
  currentMob.id = processId(mob.getElementsByClassName("id")[0].innerText);
  currentMob.level = processLevel(mob.getElementsByClassName("level")[0].innerText);
  currentMob.drop = [];
  let rawDrop = mob.getElementsByClassName("drop")[0].getElementsByTagName("span")
  for (let i = 0; i < rawDrop.length; i ++) {
    currentMob.drop.push(processDrop(rawDrop[i].innerText))
  }
  return currentMob
}


function processId(rawId) {
  rawId = rawId.trim();
  return rawId.substr(1, rawId.length - 2);
}

function processName(rawName) {
  //name form "*sfasfd sdfasdf asdf <span ...(number)</span>"
  return rawName.split("<span")[0];
}

function processLevel(rawLevel) {
  // Format :
  // Niv. 1 => Niv. 10
  // OU
  // Niv. 1
  let rawLevelSplitted = rawLevel.split(" ⇒ ")
  if (rawLevelSplitted.length > 1) {
    // Cas avec =>
    return {
      type: "range",
      min: extractLevel(rawLevelSplitted[0]),
      max: extractLevel(rawLevelSplitted[1])
    }
  } else {
    // Cas sans =>
    return {
      type: "simple",
      level: extractLevel(rawLevelSplitted[0])
    }
  }
}

function extractLevel(rawLevelWithNiv) {
  return Number.parseInt(rawLevelWithNiv.substr(5, rawLevelWithNiv.length));
}


function processDrop(rawDrop) {
  let rawDropSplitted = rawDrop.split(" (");
  return {
    name: rawDropSplitted[0],
    chance: Number.parseFloat(rawDropSplitted[1].substr(0, rawDropSplitted[1].length - 2).replace(",", "."))
  }
}

run();