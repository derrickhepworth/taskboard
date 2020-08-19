var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");

// Function handles data from form on sumbmit
// Function called on event submit from event Listener below
var taskFormHandler = function () {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //form input validation
    if(!taskNameInput || !taskTypeInput){
        alert("Please fill out the task form before adding!");
        return false;
    }

    //reset form after task added
    formEl.reset();

    // package data as object
    var taskDataObj = {
        name: taskNameInput,
        type: taskTypeInput
    };

    //send as argument to createTaskEl
    createTaskEl(taskDataObj);
}

// Create task function on submit
var createTaskEl = function (taskDataObj) {
    // creates <li> item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    //create div to hold task info and add to list item
    var taskInfoEl = document.createElement("div");

    //class name 
    taskInfoEl.className = 'task-info';

    // add HTML content to div
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";

    //add div(with html generated content and value from input) to task below task (CSS)
    listItemEl.appendChild(taskInfoEl);

    // add task to list (has value from input and div with HTM elemnts(to be formatted by CSS) with type from select inside)
    tasksToDoEl.appendChild(listItemEl);
}

formEl.addEventListener("submit", taskFormHandler);


