import { createCard, hideUnused } from "./helper/cardHelper";
import { getDropDataFromJson } from "./helper/dropDataHelper"

const mainDiv = document.getElementById("mainDiv") as HTMLDivElement;
const searchField = document.getElementById("searchInput") as HTMLInputElement;
const prevPage1 = document.getElementById("prevPage1") as HTMLButtonElement;
const nextPage1 = document.getElementById("nextPage1") as HTMLButtonElement;
const prevPage2 = document.getElementById("prevPage2") as HTMLButtonElement;
const nextPage2 = document.getElementById("nextPage2") as HTMLButtonElement;
const currentPage1 = document.getElementById("currentPage1") as HTMLSpanElement;
const currentPage2 = document.getElementById("currentPage2") as HTMLSpanElement;
const maxPage1 = document.getElementById("maxPage1") as HTMLSpanElement;
const maxPage2 = document.getElementById("maxPage2") as HTMLSpanElement;
const numRes = document.getElementById("numRes") as HTMLSpanElement;
const classicDropCheckbox = document.getElementById("classicDropCheckbox") as HTMLInputElement;
const paramButton = document.getElementById("settingButton") as HTMLButtonElement;

const dropData = getDropDataFromJson();
let selectedData = dropData
let useClassicDrop = true;

let displayedCard = 50;
let startCard = 0;

createCards();

function nextPage() {
  startCard += displayedCard;
  if (startCard > selectedData.length) {
    startCard -= displayedCard
  }
  window.scrollTo(0,0);
  deleteCards();
  createCards();
}

function prevPage() {
  startCard -= displayedCard;
  if (startCard < 0) {
    startCard = 0;
  }
  window.scrollTo(0,0);
  deleteCards();
  createCards();
}

paramButton.addEventListener("click", () => document.getElementById("settingsContent").hidden = !document.getElementById("settingsContent").hidden)

classicDropCheckbox.addEventListener("click", () => {
  useClassicDrop = classicDropCheckbox.checked;
  deleteCards();
  createCards();
})

nextPage1.addEventListener("click", debounce(() => nextPage(), 50))
nextPage2.addEventListener("click", debounce(() => nextPage(), 50))

prevPage1.addEventListener("click", debounce(() => prevPage(), 50))
prevPage2.addEventListener("click", debounce(() => prevPage(), 50))

searchField.addEventListener("input", debounce(() => {
  search(searchField.value)
}, 250))


function search(searchInput: string) {
  if (searchInput.length < 4) {
    searchInput = ""
  }
  let aaa
  selectedData = dropData.filter(elem => { 
    return (elem.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase()))
            ||
            (elem.temporisDrops.find(item => {
              return item.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
            }))
            ||
            (useClassicDrop ? elem.drops.find(item => 
              item.name.toLocaleLowerCase().includes(searchInput.toLocaleLowerCase())
            ) : false)
            
  })
  startCard = 0;
  deleteCards();
  createCards();
}

function debounce(func, wait) {
  var timeout;
  return function() {
    var context = this, args = arguments;
    var later = function() {
      timeout = null;
      func.apply(context, args);
    };
    var callNow = false && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

function createCards() {
  currentPage1.innerText = Math.ceil((startCard / displayedCard) + 1).toString();
  currentPage2.innerText = Math.ceil((startCard / displayedCard) + 1).toString();
  maxPage1.innerText = Math.ceil((selectedData.length / displayedCard)).toString();
  maxPage2.innerText = Math.ceil((selectedData.length / displayedCard)).toString();
  numRes.innerText = selectedData.length.toString();

  for (let i = startCard; i < displayedCard + startCard; i++) {
    if (selectedData[i]) createCard(selectedData[i], mainDiv, useClassicDrop)
  }
  hideUnused(dropData, selectedData, searchField.value, useClassicDrop);
}

function deleteCards() {
  document.getElementById("mainDiv").innerHTML = "";
}
