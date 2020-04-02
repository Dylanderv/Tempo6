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
  chance: dropGradeChance[]
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