import { IMobInfos, dropInfo, Grades } from "../model/IMobInfos";
// import images from "../mobImages/*.png";
import { randomCardClassColorEnum } from "../model/CardClassColorEnum";

export async function createCard(mobInfo: IMobInfos, mainElement: HTMLElement, useDropClassic: boolean) {
  if ("content" in document.createElement("template")) {
    const template = document.getElementById("cardTemplate") as HTMLTemplateElement;
    let clone = document.importNode(template.content, true);

    let figure = clone.querySelector(".card");
    let classColor = randomCardClassColorEnum()
    figure.classList.add(classColor);
    figure.setAttribute("id", mobInfo.id);

    let cardName = clone.querySelector(".card__name");
    let cardLevel = clone.querySelector(".card__type");
    let cardImg = clone.querySelector(".card__image");
    let cardTemporisDropInfo = clone.querySelector(".card__stats") as HTMLTableElement;
    let cardDropInfo = clone.querySelector(".card__stats2") as HTMLTableElement;

    cardName.innerHTML = mobInfo.name;
    if (mobInfo.level.type === "simple") {
      cardLevel.textContent = `Niv. ${mobInfo.level.level}`;
    } else {
      cardLevel.textContent = `Niv. ${mobInfo.level.min} - ${mobInfo.level.max}`;
    }
    cardImg.setAttribute("alt", "Image du mob");
    cardImg.setAttribute("src", `${mobInfo.id}.png`);

    processMobDrop(cardTemporisDropInfo, mobInfo.temporisDrops, mobInfo.name, mobInfo.grades, classColor);
    if (useDropClassic) {
      clone.getElementById("dropClassicTitle").hidden = false
      processMobDrop(cardDropInfo, mobInfo.drops, mobInfo.name, mobInfo.grades, classColor);
    } else {
      clone.getElementById("dropClassicTitle").hidden = true
    }


    mainElement.append(clone)

  } else {

  }
}

function processMobDrop(tableElement: HTMLTableElement, dropInfos: dropInfo[], name: string, mobGrades: Grades[], classColor: string) {
  //  <tr>
  //   <th>nom item</th>
  //   <td>chances</td>
  // </tr>
  dropInfos.forEach(drop => {
    let tr = document.createElement("tr");
    let th = document.createElement("th");
    let td = document.createElement("td");

    th.innerHTML = drop.name;
    td.innerHTML = handleGradeChance(drop, mobGrades, classColor);

    tr.append(th);
    tr.append(td);
    tableElement.append(tr);
  })
}

function handleGradeChance(drop: dropInfo, mobGrades: Grades[], classColor: string) {
  let gradeToDisplay: {startGrade: number, endGrade: number}[] = [];
  let startGrade = 1;
  for (let i = 0; i < drop.chance.length; i++) {
    if (!drop.chance[i].chance && drop.chance.find(dr => dr.grade === startGrade).chance) {
      gradeToDisplay.push({
        startGrade,
        endGrade: drop.chance[i].grade - 1
      });
      startGrade = drop.chance[i].grade;
    } else if (!drop.chance[i].chance && !drop.chance.find(dr => dr.grade === startGrade).chance) {
      if (i === drop.chance.length -1) {
        gradeToDisplay.push({
          startGrade,
          endGrade: drop.chance[i].grade - 1
        });
        startGrade = drop.chance[i].grade;
      }
    } else if (drop.chance[i].chance && !drop.chance.find(dr => dr.grade === startGrade).chance) {
      gradeToDisplay.push({
        startGrade,
        endGrade: drop.chance[i].grade - 1
      });
      startGrade = drop.chance[i].grade;
    } else {
      if (drop.chance.find(dr => dr.grade === startGrade).chance !== drop.chance[i].chance) {
        gradeToDisplay.push({
          startGrade,
          endGrade: drop.chance[i].grade - 1
        });
        startGrade = drop.chance[i].grade;
      }
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
    let sum = 0;
    for (let i = 0; i < gradeToDisplay.length; i++) {
      sum += drop.chance.find( dr => dr.grade === gradeToDisplay[i].startGrade).chance ? drop.chance.find( dr => dr.grade === gradeToDisplay[i].startGrade).chance : 0;
    }
    let moy = sum / gradeToDisplay.length;
    let tableDrop = `<table>`;
    gradeToDisplay.forEach(grade => {
      if (grade.startGrade === grade.endGrade) {
        tableDrop += `
          <tr>
            <th>
              Niv. ${mobGrades.find(gr => gr.grade === grade.startGrade).level}
            <th>
            <td>
              ${drop.chance.find(dr => dr.grade === grade.startGrade).chance.toFixed(2)}%
            <td>
          <tr>
        `
      } else {
        tableDrop += `
          <tr>
            <th>
              Niv. ${mobGrades.find(gr => gr.grade === grade.startGrade).level} à ${mobGrades.find(gr => gr.grade === grade.endGrade).level}
            <th>
            <td>
              ${drop.chance.find(dr => dr.grade === grade.startGrade).chance ? drop.chance.find( dr => dr.grade === grade.startGrade).chance.toFixed(2) : 0}%
            <td>
          <tr>
        `
      }
    })
    tableDrop += "</table>";
    let cl = classColor.substr(6, classColor.length) + "Background"
    let tooltip = `
    <div class="tooltip">≈${moy.toFixed(2)}% (?)
      <span class="tooltiptext">
        <span class="tooltiptextcontent ${cl}">${tableDrop}</span>
      </span>
    </div>
  `
    return tooltip;
  }

}

export function hideUnused(allData: IMobInfos[], selectedData: IMobInfos[], searchInput: string, useDropClassic: boolean) {
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
      let temporisDropElement = htmlElement.querySelector(".card__stats").children;
      for (let i = 0; i < temporisDropElement.length; i++) {
        let dropElement = temporisDropElement.item(i).querySelector("th")
        dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexMarkStart, () => "")
        dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexMarkEnd, () => "")
        // dropElement.innerHTML = dropElement.innerHTML.toString().split("<mark>").join("").split("</mark>").join("");
        dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexSearch, (match) => `<mark>${match}</mark>`)
      }
      if (useDropClassic) {
        let otherDropElement = htmlElement.querySelector(".card__stats2").children;
        for (let i = 0; i < otherDropElement.length; i++) {
          let dropElement = otherDropElement.item(i).querySelector("th")
          dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexMarkStart, () => "")
          dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexMarkEnd, () => "")
          // dropElement.innerHTML = dropElement.innerHTML.toString().split("<mark>").join("").split("</mark>").join("");
          dropElement.innerHTML = dropElement.innerHTML.toString().replace(regexSearch, (match) => `<mark>${match}</mark>`)
        }
      }

      htmlElement.classList.remove("hidden")

    }
  });
}
