const addBtns = document.querySelectorAll(".add-btn:not(.solid)");
const saveItemBtns = document.querySelectorAll(".solid");
const addItemContainers = document.querySelectorAll(".add-container");
const addItems = document.querySelectorAll(".add-item");
// Item Lists
const columnlists = document.querySelectorAll(".drag-item-list");
const backlogList = document.getElementById("backlog-list");
const progressList = document.getElementById("progress-list");
const completeList = document.getElementById("complete-list");
const onHoldList = document.getElementById("on-hold-list");

// Items
let updatedOnload = false;
// Initialize Arrays
let backlogListArray = [];
let progressListArray = [];
let completeListArray = [];
let onHoldListArray = [];
let listArrays = [];

// Drag Functionality
let draggedItem;
let dragging = false;
let currentColumn;
// Get Arrays from localStorage if available, set default values if not
function getSavedColumns() {
  if (localStorage.getItem("backlogItems")) {
    backlogListArray = JSON.parse(localStorage.backlogItems);
    progressListArray = JSON.parse(localStorage.progressItems);
    completeListArray = JSON.parse(localStorage.completeItems);
    onHoldListArray = JSON.parse(localStorage.onHoldItems);
  } else {
    backlogListArray = ["Release the course", "Sit back and relax"];
    progressListArray = ["Work on projects"];
    completeListArray = ["Being cool", "Getting stuff done"];
    onHoldListArray = ["Being uncool", "Listen to music"];
  }
}
getSavedColumns();
updateSavedColumns();
// Set localStorage Arrays
function updateSavedColumns() {
  listArrays = [
    backlogListArray,
    progressListArray,
    completeListArray,
    onHoldListArray,
  ];
  const arrayNames = ["backlog", "progress", "complete", "onHold"];
  arrayNames.forEach((item, idx) => {
    localStorage.setItem(item, JSON.stringify(listArrays[idx]));
  });
  // for (let i = 0; i < arrayNames.length; i++) {
  //   localStorage.setItem(
  //     `${arrayNames[i]}Items`,
  //     JSON.stringify(listArrays[i])
  //   );
  // }
  // localStorage.setItem("progressItems", JSON.stringify(progressListArray));
  // localStorage.setItem("completeItems", JSON.stringify(completeListArray));
  // localStorage.setItem("onHoldItems", JSON.stringify(onHoldListArray));
}
function filterArray(array) {
  console.log(array);
  const filteredArray = array.filter((item) => item !== null);
  console.log(filteredArray);
  return filteredArray;
}
// Create DOM Elements for each list item
function createItemEl(columnEl, column, item, index) {
  // console.log("columnEl:", columnEl);
  // console.log("column:", column);
  // console.log("item:", item);
  // console.log("index:", index);
  // List Item
  const listEl = document.createElement("li");
  listEl.classList.add("drag-item");
  listEl.textContent = item;
  listEl.draggable = true;
  listEl.setAttribute("ondragStart", "drag(event)");
  listEl.contentEditable = true;
  listEl.id = index;
  console.log(column);
  listEl.setAttribute("onfocusout", `updateItem(${index},${column})`);
  columnEl.appendChild(listEl);
}

// Update Columns in DOM - Reset HTML, Filter Array, Update localStorage
function updateDOM() {
  // Check localStorage once
  if (!updatedOnload) {
    getSavedColumns();
  }
  // Backlog Column
  backlogList.textContent = "";
  backlogListArray.forEach((item, idx) => {
    createItemEl(backlogList, 0, item, idx);
  });
  backlogListArray = filterArray(backlogListArray);
  // Progress Column
  progressList.textContent = "";
  progressListArray.forEach((item, idx) => {
    createItemEl(progressList, 1, item, idx);
  });
  progressListArray = filterArray(progressListArray);
  // Complete Column
  completeList.textContent = "";
  completeListArray.forEach((item, idx) => {
    createItemEl(completeList, 2, item, idx);
  });
  completeListArray = filterArray(completeListArray);
  // On Hold Column
  onHoldList.textContent = "";
  onHoldListArray.forEach((item, idx) => {
    createItemEl(onHoldList, 3, item, idx);
  });
  onHoldListArray = filterArray(onHoldListArray);
  // Run getSavedColumns only once, Update Local Storage
  updatedOnload = true;
  updateSavedColumns();
}

// Update item
function updateItem(id, column) {
  const selectedArray = listArrays[column];
  // console.log(selectedArray);
  const selectedColumnEl = columnlists[column].children;
  console.log(columnlists);
  console.log(selectedColumnEl[id].textContent);
  if (!dragging) {
    if (!selectedColumnEl[id].textContent) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumnEl[id].textContent;
    }
    updateDOM();
  }
}
function addToColumns(column) {
  const itemText = addItems[column].textContent;
  const selectedArray = listArrays[column];
  selectedArray.push(itemText);
  addItems[column].textContent = "";
  updateDOM();
}

function showInputBox(column) {
  addBtns[column].style.visibility = "hidden";
  saveItemBtns[column].style.display = "flex";
  addItemContainers[column].style.display = "flex";
}
function hideInputBox(column) {
  addBtns[column].style.visibility = "visible";
  saveItemBtns[column].style.display = "none";
  addItemContainers[column].style.display = "none";
  addToColumns(column);
}

function rebuildArrays() {
  console.log(backlogList.children);
  // console.log(progressList.children);
  // console.log(onHoldList.children);
  backlogListArray = [];
  for (let i = 0; i < backlogList.children.length; i++) {
    backlogListArray.push(backlogList.children[i].textContent);
  }
  progressListArray = [];
  for (let i = 0; i < progressList.children.length; i++) {
    progressListArray.push(progressList.children[i].textContent);
  }
  completeListArray = [];
  for (let i = 0; i < completeList.children.length; i++) {
    completeListArray.push(completeList.children[i].textContent);
  }
  onHoldListArray = [];
  for (let i = 0; i < onHoldList.children.length; i++) {
    onHoldListArray.push(onHoldList.children[i].textContent);
  }
  updateDOM();
}

function drag(e) {
  draggedItem = e.target;
  dragging = true;
}
// all drop
function allowDrop(e) {
  e.preventDefault();
}
function drop(e) {
  e.preventDefault();
  columnlists.forEach((column) => {
    column.classList.remove("over");
  });
  const parent = columnlists[currentColumn];
  parent.appendChild(draggedItem);
  // console.log(parent);
  dragging = false;
  rebuildArrays();
}
function dragEnter(column) {
  columnlists[column].classList.add("over");
  currentColumn = column;
}
updateDOM();
