// local storage key ir elementai
let LS_KEY = "cartList";

let idInput   = document.getElementById("idInput");
let nameInput = document.getElementById("nameInput");
let qtyInput  = document.getElementById("qtyInput");

let insertBtn = document.getElementById("insertBtn");
let editBtn   = document.getElementById("editBtn");
let deleteBtn = document.getElementById("deleteBtn");
let clearBtn  = document.getElementById("clearBtn");

let findInput = document.getElementById("findInput");
let findBtn   = document.getElementById("findBtn");

let msg       = document.getElementById("msg");
let allBody   = document.querySelector("#allTable tbody");
let foundBody = document.querySelector("#foundTable tbody");


// load ir save local storage
let loadList = () => {
  let raw = localStorage.getItem(LS_KEY);
  if (!raw) return [];
  try { return JSON.parse(raw); }
  catch { return []; }
};

let saveList = (list) => {
  localStorage.setItem(LS_KEY, JSON.stringify(list));
};


// table kurimas
let makeRow = (item) => {
  let tr = document.createElement("tr");
  tr.dataset.id = item.id;

  let td1 = document.createElement("td");
  let td2 = document.createElement("td");
  let td3 = document.createElement("td");

  td1.textContent = item.id;
  td2.textContent = item.name;
  td3.textContent = item.quantity;

  tr.appendChild(td1);
  tr.appendChild(td2);
  tr.appendChild(td3);

  return tr;
};


// ui dalis
let showMsg = (text, ok = true) => {
  msg.textContent = text;
  msg.style.color = ok ? "green" : "crimson";
};

let clearForm = () => {
  idInput.value = "";
  nameInput.value = "";
  qtyInput.value = "";
};


// krovimas ir table kurimas
let existing = loadList();
for (let i = 0; i < existing.length; i++) {
  allBody.appendChild(makeRow(existing[i]));
}


// insert mygtukas
insertBtn.addEventListener("click", () => {
  let id = idInput.value.trim();
  let name = nameInput.value.trim();
  let quantity = qtyInput.value.trim();

  if (!id || !name || !quantity) {
    showMsg("Užpildykite visus laukus.", false);
    return;
  }

  let list = loadList();
  let exists = false;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) exists = true;
  }

  if (exists) {
    showMsg("Toks ID jau egzistuoja.", false);
    return;
  }

  let item = { id, name, quantity };
  list.push(item);
  saveList(list);

  allBody.appendChild(makeRow(item));
  showMsg("Prekė pridėta.");
});

// find mygtukas
findBtn.addEventListener("click", () => {
  let id = findInput.value.trim();
  foundBody.innerHTML = "";

  if (!id) {
    showMsg("Įveskite ID paieškai.", false);
    return;
  }

  let list = loadList();
  let found = null;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      found = list[i];
      break;
    }
  }

  if (!found) {
    showMsg("Prekė nerasta.", false);
    return;
  }

  foundBody.appendChild(makeRow(found));
  showMsg("Prekė rasta.");
});


// edit mygtukas
editBtn.addEventListener("click", () => {
  let id = idInput.value.trim();
  let name = nameInput.value.trim();
  let quantity = qtyInput.value.trim();

  if (!id || !name || !quantity) {
    showMsg("Užpildykite visus laukus.", false);
    return;
  }

  let list = loadList();
  let index = -1;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) index = i;
  }

  if (index === -1) {
    showMsg("Tokio ID nėra.", false);
    return;
  }

  list[index] = { id, name, quantity };
  saveList(list);

  let row = allBody.querySelector(`tr[data-id="${id}"]`);
  if (row) {
    row.children[1].textContent = name;
    row.children[2].textContent = quantity;
  }

  showMsg("Prekė atnaujinta.");
});


// delete mygtukas
deleteBtn.addEventListener("click", () => {
  let id = idInput.value.trim();
  if (!id) {
    showMsg("Įveskite ID trynimui.", false);
    return;
  }

  let list = loadList();
  let newList = [];
  let removed = false;

  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) removed = true;
    else newList.push(list[i]);
  }

  if (!removed) {
    showMsg("Tokio ID nėra – neištrinta.", false);
    return;
  }

  saveList(newList);

  let row = allBody.querySelector(`tr[data-id="${id}"]`);
  if (row) row.remove();

  if (foundBody.firstChild && foundBody.firstChild.children[0].textContent === id) {
    foundBody.innerHTML = "";
  }

  showMsg("Prekė ištrinta.");
});


// clear form mygtukas
clearBtn.addEventListener("click", () => {
  clearForm();
  showMsg("");
});
