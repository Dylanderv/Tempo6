const i18n_fr = require("./dofusData/i18n_fr.json");
const Spell = require("./dofusData/Spells.json");
const SpellTypes = require("./dofusData/SpellTypes.json");
const SpellLevels = require("./dofusData/SpellLevels.json");

function translate(id) {
    return i18n_fr.texts[id]
}

/*
{
  id: 0,        
  nameId: 64658,
  descriptionId: 618571,
  typeId: 21,
  order: 0,
  scriptParams: 'animId:0',
  scriptParamsCritical: 'null',
  scriptId: 1,
  scriptIdCritical: 0,
  iconId: 0,
  spellLevels: [ 10461 ],
  verbose_cast: true,
  default_zone: 'null',
  bypassSummoningLimit: false,
  canAlwaysTriggerSpells: false,
  adminName: 'null'
}
*/

console.log(Spell[0])

const currentSpell = Spell[0];
const exportedCurrentSpell = {};

exportedCurrentSpell.Name = translate(currentSpell.nameId);
exportedCurrentSpell.Description = translate(currentSpell.descriptionId);
exportedCurrentSpell.Type = translate(SpellTypes.find(x => x.id === currentSpell.typeId).longNameId);
exportedCurrentSpell.Levels = currentSpell.spellLevels.map(lvlId => SpellLevels.find(x => x.id === lvlId));

console.log(exportedCurrentSpell)

const currentLevel = exportedCurrentSpell.Levels[0];
const exportedCurrentLevel = {};

exportedCurrentLevel.ApCost = currentLevel.apCost
exportedCurrentLevel.MinRange = currentLevel.minRange
exportedCurrentLevel.Range = currentLevel.range
exportedCurrentLevel.IsInLine = currentLevel.castInLine
exportedCurrentLevel.IsInDiagonal = currentLevel.castInDiagonal
exportedCurrentLevel.CriteRate = currentLevel.criticalHitProbability
exportedCurrentLevel.MaxStack = currentLevel.maxStack
exportedCurrentLevel.MaxCastPerTurn = currentLevel.maxCastPerTurn
exportedCurrentLevel.MaxCastPerTarget = currentLevel.maxCastPerTarget
exportedCurrentLevel.MinCastInterval = currentLevel.minCastInterval
exportedCurrentLevel.InitialCooldown = currentLevel.initialCooldown
exportedCurrentLevel.GlobalCooldown = currentLevel.globalCooldown
exportedCurrentLevel.MinPlayerLevel = currentLevel.minPlayerLevel
exportedCurrentLevel.effects = currentLevel.effects

console.log(exportedCurrentLevel)

currentEffect = exportedCurrentLevel.effects[0];
console.log(currentEffect)