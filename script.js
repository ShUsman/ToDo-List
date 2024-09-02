import "./main.css";

const content = document.getElementById("content");

export class Header {
  constructor(parent, parentClass, title, titleClass, titleText) {
    this.parent = document.createElement(parent);
    this.parent.classList.add(parentClass);
    this.title = document.createElement(title);
    this.title.classList.add(titleClass);
    this.title.textContent = titleText;
  }
  create() {
    this.parent.append(this.title);
    return this.parent;
  }
}

class Task {
  constructor() {
    this.tasks = [];
  }

  addTaskToArray(text, date, id) {
    this.tasks.push({text, date, id});    
    localStorage.setItem("saveTask", JSON.stringify(this.tasks));
  }

  removeTaskFromArray(id){
    this.tasks = this.tasks.filter(task => task.id !== id);
    localStorage.setItem("saveTask",  JSON.stringify(this.tasks));
  }
}

const tasksArray = new Task();


const header = new Header(
  "div",
  "header",
  "h1",
  "header-title",
  "What will we do Today?"
).create();

content.prepend(header);

class Sidebar {
  constructor(sidebarId) {
    this.sidebar = document.getElementById(sidebarId);
    this.sidebarTasks = [];
  }

  addTaskToArray(text, date, CheckBoxId) {
    this.sidebarTasks.push({text, date, id:CheckBoxId});
    this.updateSidebar();
  }
  
  removeTaskFromArray(id) {
    this.sidebarTasks = this.sidebarTasks.filter(task => task.id !== id);
    this.updateSidebar();
  }

  updateSidebar() {
    this.sidebar.innerHTML = "";
    this.sidebarTasks.forEach(task => {
      const sidebarItem = document.createElement("div");
      sidebarItem.classList.add("sidebar-item");
      sidebarItem.innerHTML = `<p>${task.text}</p><p>${task.date}</p>`;
      this.sidebar.appendChild(sidebarItem);
    });
  }
}

const sidebar = new Sidebar("sidebar");

class AddForm {
  addInputForm(e) {
    e.currentTarget.parentElement.innerHTML = `
    <div class="add-task">
        <form action="get">
            <input type="radio" name="add" id="add" class="confirm">
            <input type="text" class="add-txt">
            <input type="date" class="date-time"></input>
        </form>
    </div>
    `;

    const confirm = document.querySelector(".confirm");
    const addTxt = document.querySelector(".add-txt");
    const date = document.querySelector(".date-time");

    confirm.addEventListener("click", () => {
      this.checkAndAddNewForm(addTxt.value, date.value);
    });

    addTxt.addEventListener("keydown", (event) => {
      if (event.key === "Enter") {
        event.preventDefault();
        this.checkAndAddNewForm(addTxt.value, date.value);
      }
    });
  }

  checkAndAddNewForm(inputValue, dateValue) {
    if (inputValue.trim() === "") {
        alert("Ты задачу забыл");
        return; 
    }

    if (!dateValue) { 
        const today = new Date();
        dateValue = today.toLocaleDateString('en-CA'); 
    }

    this.addNewForm(inputValue, dateValue); 
  }

  addNewForm(text, date) {
    const newForm = document.createElement("div");
    const taskId = Math.random();
    tasksArray.addTaskToArray(text, date, taskId);
    newForm.classList.add("add-new-task");
    newForm.innerHTML = `
        <form action="get">
            <input type="checkbox" data-id="${taskId}" name="add" id="add" class="confirm done">
            <input type="text" class="add-txt" value="${text}">
            <input type="date" class="date-time new-one" value="${date}">
            <button type="button" class="delete-button">🗑️</button>
        </form>
    `;
    content.appendChild(newForm);

    const taskDone = newForm.querySelector(".done");
    const removeButton = newForm.querySelector(".delete-button");
    const taskText = newForm.querySelector(".add-txt");

    taskDone.addEventListener("click", (e) => {
      const CheckBoxId = e.target.dataset.id;
      if (taskDone.checked) {
        taskText.style.textDecoration = "line-through";
        taskText.style.color = "grey";
        sidebar.addTaskToArray(taskText.value, date, CheckBoxId);
      } else {
        sidebar.removeTaskFromArray(CheckBoxId);
        taskText.style.textDecoration = "none";
        taskText.style.color = "black";
      }
    });

    removeButton.addEventListener("click", () => {
        newForm.remove(); 
    });

    document.querySelector(".add-txt").value = "";
    document.querySelector(".date-time").value = "";
  }
}

const addInput = new AddForm();

class Button {
  constructor(
    parent,
    parentClass,
    taskButton,
    taskButtonClass,
    spanTag,
    spanText
  ) {
    this.parent = document.createElement(parent);
    this.parent.classList.add(parentClass);
    this.taskButton = document.createElement(taskButton);
    this.taskButton.classList.add(taskButtonClass);
    this.parent.append(this.taskButton);
    this.span = document.createElement(spanTag);
    this.span.textContent = spanText;
    this.taskButton.appendChild(this.span);
  }

  add() {
    this.taskButton.addEventListener("click", (e) => {
      addInput.addInputForm(e);
    });
    return this.parent;
  }
}

const addButton = new Button(
  "div",
  "add-taskbutton",
  "button",
  "open-modal",
  "span",
  "Add Task"
).add();

content.append(addButton);
