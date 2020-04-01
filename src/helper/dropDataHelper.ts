import dropData from "../data/dropData.json"
import { IMobInfos } from "../model/IMobInfos"

export function getDropDataFromJson(): IMobInfos[] {
  return dropData as IMobInfos[]
}
