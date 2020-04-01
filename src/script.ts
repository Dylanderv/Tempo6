import { createCard, hideUnused } from "./helper/cardHelper";
import { getDropDataFromJson } from "./helper/dropDataHelper"

const mainDiv = document.getElementById("mainDiv") as HTMLDivElement;
const searchField = document.getElementById("searchInput") as HTMLInputElement;

const dropData = getDropDataFromJson();
let selectedData = dropData

createCards();

searchField.addEventListener("input", () => {
  search(searchField.value)
})

function search(searchInput: string) {
  selectedData = dropData.filter(elem => {
    return elem.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
            ||
            elem.drop.filter(item => 
              item.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
            ).length > 0
  })
  console.log(selectedData.length, dropData.length);
  hideUnused(dropData, selectedData, searchInput);
}

function createCards() {
  selectedData.forEach(elem => createCard(elem, mainDiv));
}
