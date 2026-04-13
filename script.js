const db = supabase.createClient(
  "https://qwznbqdjlqjdphouqbko.supabase.co",
  "sb_publishable_mi6ceP4lTqFNpcgSSuLMow_GHCGN_uM"
);

// Variables
let list = document.querySelector("#list");
let create = document.querySelector("#add");
let activityInput = document.querySelector("#itemName");
let categoryInput = document.querySelector("#itemCategory");
let timeTakenInput = document.querySelector("#itemTime");
let completedStatus = document.querySelector("#itemCompleted");
let editingID;

create.addEventListener("click", saveInput);

let currentEditID = null;

// Save input function
function saveInput() {
  if (currentEditID === null) {
    createRow();
  } else {
    editRow(currentEditID);
    currentEditID = null;
    create.textContent = "Add Activity";
  }
}

// fill input fields function for edits
function fillInputWithEdit(entry) {
  activityInput.value = entry.name;
  categoryInput.value = entry.category;
  timeTakenInput.value = entry.time;
  completedStatus.value = entry.complete_status;
  currentEditID = entry.id;
  create.textContent = "Save Edit";
  activityInput.focus();
}

async function getAll() {
  let { data, error } = await db.from("activities").select("*");

  if (error) {
    console.error(error);
    return;
  }

  list.innerHTML = "";
  for (const entry of data) {
    let div = document.createElement("div");
    list.appendChild(div);

    let activityName = document.createElement("p");
    activityName.textContent = entry.name;
    div.appendChild(activityName);

    let activityCategory = document.createElement("p");
    activityCategory.textContent = entry.category;
    div.appendChild(activityCategory);

    let activityTime = document.createElement("p");
    activityTime.textContent = entry.time;
    div.appendChild(activityTime);

    let activityComplete = document.createElement("p");
    activityComplete.textContent = entry.complete_status;
    div.appendChild(activityComplete);

    let deleteBtn = document.createElement("button");
    deleteBtn.textContent = "Delete";
    deleteBtn.addEventListener("click", () => deleteRowById(entry.id));
    div.appendChild(deleteBtn);

    let editBtn = document.createElement("button");
    editBtn.textContent = "Edit";
    editBtn.addEventListener("click", () => fillInputWithEdit(entry));
    div.appendChild(editBtn);
  }
}
getAll();

async function createRow() {
  if (activityInput.value === "") {
    activityInput.placeholder = "Give activity a name";
    return;
  } else {
    console.log("createRow fired");
    const { data, error } = await db
      .from("activities")
      .insert([
        {
          name: activityInput.value,
          category: categoryInput.value,
          time: timeTakenInput.value,
          complete_status: completedStatus.value,
        },
      ])
      .select();
    if (error) {
      console.error(error);
    }
    activityInput.value = "";
    activityInput.placeholder = "";
    categoryInput.value = "";
    timeTakenInput.value = "";
    getAll();
  }
}

async function deleteRowById(id) {
  const { error } = await db.from("activities").delete().eq("id", id);
  if (error) {
    console.error(error);
  }
  getAll();
}

async function editRow(id) {
  const { data, error } = await db
    .from("activities")
    .update({
      name: activityInput.value,
      category: categoryInput.value,
      time: timeTakenInput.value,
      complete_status: completedStatus.value,
    })
    .eq("id", id)
    .select();
  if (error) {
    console.error(error);
  }

  activityInput.value = "";
  activityInput.placeholder = "";
  categoryInput.value = "";
  timeTakenInput.value = "";

  getAll();
}
