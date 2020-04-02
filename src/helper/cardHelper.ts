import { IMobInfos, dropInfo } from "../model/IMobInfos";
// import images from "../mobImages/*.png";
import { randomCardClassColorEnum } from "../model/CardClassColorEnum";

export async function createCard(mobInfo: IMobInfos, mainElement: HTMLElement) {
  if ("content" in document.createElement("template")) {
    const template = document.getElementById("cardTemplate") as HTMLTemplateElement;
    let clone = document.importNode(template.content, true);

    let figure = clone.querySelector(".card");
    figure.classList.add(randomCardClassColorEnum());
    figure.setAttribute("id", mobInfo.id);

    let cardName = clone.querySelector(".card__name");
    let cardLevel = clone.querySelector(".card__type");
    let cardImg = clone.querySelector(".card__image");
    let cardDropInfo = clone.querySelector(".card__stats") as HTMLTableElement;

    cardName.innerHTML = mobInfo.name;
    if (mobInfo.level.type === "simple") {
      cardLevel.textContent = `Niv. ${mobInfo.level.level}`;
    } else {
      cardLevel.textContent = `Niv. ${mobInfo.level.min} - ${mobInfo.level.max}`;
    }
    cardImg.setAttribute("alt", "Image du mob");
    cardImg.setAttribute("src", `${mobInfo.id}.png`);

    processMobDrop(cardDropInfo, mobInfo.temporisDrops, mobInfo.name);

    mainElement.append(clone)

  } else {

  }
}

function processMobDrop(tableElement: HTMLTableElement, dropInfos: dropInfo[], name: string) {
  //  <tr>
  //   <th>nom item</th>
  //   <td>chances</td>
  // </tr>
  dropInfos.forEach(drop => {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let td = document.createElement("td");

    th.innerHTML = drop.name;
    td.textContent = handleGradeChance(drop, name);

    tr.append(th);
    tr.append(td);
    tableElement.append(tr);
  })
}

function handleGradeChance(drop: dropInfo, name: string) {
  let gradeToDisplay: {startGrade: number, endGrade: number}[] = [];
  let startGrade = 1;
  for (let i = 0; i < drop.chance.length; i++) {
    if (drop.chance.find(dr => dr.grade === startGrade).chance !== drop.chance[i].chance) {
      gradeToDisplay.push({
        startGrade,
        endGrade: drop.chance[i].grade - 1
      });
      startGrade = drop.chance[i].grade;
    }
  }
  if (gradeToDisplay.length === 0) {
    gradeToDisplay.push({
      startGrade: 1,
      endGrade: 5
    });
  }

  if (gradeToDisplay.length === 1) {
    return `${(drop.chance[0].chance.toFixed(2)).toString()}%`;
  } else {
    return "WIP"
  }
}

export function hideUnused(allData: IMobInfos[], selectedData: IMobInfos[], searchInput: string) {
  let unused = allData.filter(data => selectedData.findIndex(elem => elem.id === data.id) === -1);
  unused.forEach(elem => document.getElementById(elem.id)?.classList.add("hidden"));
  selectedData.forEach(elem => {
    let htmlElement = document.getElementById(elem.id)
    if (htmlElement) {

      let nameElement = htmlElement.querySelector(".card__name");
      let regexSearch = new RegExp(searchInput, "gi");
      let regexMarkStart = new RegExp("<mark>", "gi");
      let regexMarkEnd = new RegExp("</mark>", "gi");
      nameElement.innerHTML = nameElement.innerHTML.toString().replace(regexMarkStart, () => "")
      nameElement.innerHTML = nameElement.innerHTML.toString().replace(regexMarkEnd, () => "")
      // nameElement.innerHTML = nameElement.innerHTML.toString().split("<mark>").join("").split("</mark>").join("");
      nameElement.innerHTML = nameElement.innerHTML.toString().replace(regexSearch, (match) => `<mark>${match}</mark>`)
      // drop
      let allDropElement = htmlElement.querySelector(".card__stats").children;
      for (let i = 0; i < allDropElement.length; i++) {
        let dropElement = allDropElement.item(i).querySelector("th")
        dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexMarkStart, () => "")
        dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexMarkEnd, () => "")
        // dropElement.innerHTML = dropElement.innerHTML.toString().split("<mark>").join("").split("</mark>").join("");
        dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexSearch, (match) => `<mark>${match}</mark>`)
      }

      htmlElement.classList.remove("hidden")

    }
  });
}

// Compare string with case insensitive and return the matching string in stringToCompare
function compareString(stringToCompare: string, comparator: string) {
  let reg = new RegExp(comparator, 'i')
  let num = stringToCompare.search(reg);
  if (num !== -1) {
    return stringToCompare.substr(num, comparator.length);
  } else {
    return ""
  }
}
