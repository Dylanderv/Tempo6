export interface IMobInfos {
  name: string;
  id: string;
  level: simpleLevelType | rangeLevelType,
  drop: dropInfo[]
}

export interface dropInfo {
  name: string,
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
