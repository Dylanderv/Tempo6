export enum CardClassColorEnum {
  "Normal" = "card--normal",
  "Water" = "card--water",
  "Electric" = "card--electric",
  "Fire" = "card--fire",
  "Psychic" = "card--psychic",
  "Dark" = "card--dark",
  "Grass" = "card--grass",
  "Ice" = "card--ice",
  "Fairy" = "card--fairy"
}

export function randomCardClassColorEnum(): string {
  const enumValues = Object.keys(CardClassColorEnum);
  const randomIndex = Math.floor(Math.random() * enumValues.length)
  const randomEnumValue = enumValues[randomIndex]
  return CardClassColorEnum[randomEnumValue];
}
