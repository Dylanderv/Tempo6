const i18n_fr = require("./dofusData/i18n_fr.json");
const Items = require("./dofusData/Items.json");
// const ItemSets = require("./dofusData/ItemSets.json");
// const ItemTypes = require("./dofusData/ItemTypes.json");
// const MonsterMiniBoss = require("./dofusData/MonsterMiniBoss.json");
const Monsters = require("./dofusData/Monsters.json");
// const MonsterSuperRaces = require("./dofusData/MonsterSuperRaces.json");
// const Mounts = require("./dofusData/Mounts.json");
const Tempo_Learn_Spell_Effect_Id = 2875;


// Structure
/*
export interface IMobInfos {
  name: string;
  id: string;
  level: simpleLevelType | rangeLevelType,
  drops: dropInfo[],
  temporisDrops: dropInfo[]
  grades: Grades[]
}

export interface Grades {
  grade: number,
  level: number
}

export interface dropInfo {
  name: string,
  chance: dropGradeChance
}

interface dropGradeChance {
  grade: number,
  chance: number
}

interface simpleLevelType {
  type: "simple",
  level: number
}

interface rangeLevelType {
  type: "range",
  min: number,
  max: number
}
*/
const dropInfoArray = []


function link() {
  // Besoin 
  // Nom, id, range de level & drop (item name + chances) && id du spell si s'en est un (sinon null)
  Monsters.forEach((elem, index) => {
    let dropInfo = {};
    dropInfo.id = elem.id;
    dropInfo.name = i18n_fr.texts[elem.nameId];
    
    if (elem.grades.length > 1) {
      let levels = elem.grades.map(grade => grade.level)
      dropInfo.level = {
        type: "range",
        min: Math.min(...levels),
        max: Math.max(...levels)
      }
    } else {
      dropInfo.level = {
        type: "simple",
        level: elem.grades[0].level
      }
    }
    dropInfo.grades = elem.grades.map(gr => {
      return {
        grade: gr.grade,
        level: gr.level
      }
    })

    if (elem.drops) {
      dropInfo.drops = dropHandler(elem.drops, dropInfo.grades)
    }
    if (elem.temporisDrops) {
      dropInfo.temporisDrops = dropHandler(elem.temporisDrops, dropInfo.grades);
    }

    dropInfoArray.push(dropInfo);
  });
  // console.log(dropInfoArray.find(drop => drop.id === 6048).drop[0]);
}

function dropHandler(drops, grades) {
  let dropToReturn = [];
  drops.forEach((drop, indexDrop) => {
    let dropToAdd = {};
    let item = Items.find(it => it.id === drop.objectId);
    if (item === undefined) {
      dropToAdd.id = drop.objectId;
      dropToAdd.name = "Unknown objectId: " + drop.objectId
      dropToAdd.spellId = Items.find(x => x.id === drop.objectId)?.possibleEffects.find(x => x.effectId === Tempo_Learn_Spell_Effect_Id)?.value
      dropToAdd.chance = grades.map(gr => {
        return {
          grade: gr.grade,
          chance: drop[`percentDropForGrade${gr.grade}`]
        }
      })
    } else {
      dropToAdd.id = drop.objectId;
      dropToAdd.name = i18n_fr.texts[item.nameId]
      dropToAdd.spellId = Items.find(x => x.id === drop.objectId)?.possibleEffects.find(x => x.effectId === Tempo_Learn_Spell_Effect_Id)?.value
      dropToAdd.chance = grades.map(gr => {
        return {
          grade: gr.grade,
          chance: drop[`percentDropForGrade${gr.grade}`]
        }
      })
    }

    dropToReturn.push(dropToAdd)
  })
  return dropToReturn;
}

link();

let larve = dropInfoArray.filter(el => el.id === 31)[0];
console.log(larve)
console.log(larve.drop);
console.log(larve.temporisDrops);

// console.log(JSON.stringify(dropInfoArray.filter(el => el.name !== undefined && el.drops.length > 0 && el.temporisDrops.length > 0)));
