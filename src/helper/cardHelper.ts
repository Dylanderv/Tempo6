import { IMobInfos, dropInfo } from "../model/IMobInfos";
import images from "../mobImages/*.png";
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
    cardImg.setAttribute("src", images[mobInfo.id]);

    processMobDrop(cardDropInfo, mobInfo.drop);

    mainElement.append(clone)

  } else {

  }
}

function processMobDrop(tableElement: HTMLTableElement, dropInfos: dropInfo[]) {
  //  <tr>
  //   <th>nom item</th>
  //   <td>chances</td>
  // </tr>
  dropInfos.forEach(drop => {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let td = document.createElement("td");

    th.innerHTML = drop.name;
    td.textContent = `${drop.chance.toString()}%`;

    tr.append(th);
    tr.append(td);
    tableElement.append(tr);
  })
}

export function hideUnused(allData: IMobInfos[], selectedData: IMobInfos[], searchInput: string) {
  let unused = allData.filter(data => selectedData.findIndex(elem => elem.id === data.id) === -1);
  unused.forEach(elem => document.getElementById(elem.id).classList.add("hidden"));
  selectedData.forEach(elem => {
    let htmlElement = document.getElementById(elem.id)
    // name
    // let nameElement = htmlElement.querySelector(".card__name");
    // console.log(nameElement)
    // nameElement.innerHTML.
    // let nameSplittedBySearch = nameElement.innerHTML.toString().split(searchInput);
    // nameElement.innerHTML = nameSplittedBySearch.join(`<span class="underline">${searchInput}</span>`);
    // drop
    htmlElement.classList.remove("hidden")
  });
}

// // Compare string with case insensitive and return the matching string from
// function compareString(stringToCompare: string, comparator: string)
