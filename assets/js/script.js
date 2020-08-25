var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

// Function handles data from form on sumbmit
// Function called on event submit from event Listener below
var taskFormHandler = function () {
    event.preventDefault();
    var taskNameInput = document.querySelector("input[name='task-name']").value;
    var taskTypeInput = document.querySelector("select[name='task-type']").value;

    //form input validation
    if (!taskNameInput || !taskTypeInput) {
        alert("Please fill out the task form before adding!");
        return false;
    }

    //reset form after task added
    formEl.reset();

    var completeEditTask = function (taskName, taskType, taskId) {
        // find matching task list item
        var taskSelected = document.querySelector(".task-item[data-task-id= '" + taskId + "']");

        //set new values
        taskSelected.querySelector("h3.task-name").textContent = taskName;
        taskSelected.querySelector("span.task-type").textContent = taskType;


        //loop through tasks array and task object with new content
        for (var i =0; i< tasks.length; i++) {
            if (tasks[i].id === parseInt(taskId)) {
                tasks[i].name = taskName;
                tasks[i].type = taskType;
            }
        };

        alert("Task Updated!");
        formEl.removeAttribute("data-task-id");
        document.querySelector("#save-task").textContent = "Add Task";
        saveTasks();
    };

    //conditional function for edit vs. new task
    var isEdit = formEl.hasAttribute("data-task-id");
    if (isEdit) {
        var taskId = formEl.getAttribute("data-task-id");
        completeEditTask(taskNameInput, taskTypeInput, taskId);

    } else {
       
        // package data as object
        var taskDataObj = {
            name: taskNameInput,
            type: taskTypeInput,
            status: "to do"
        };

        createTaskEl(taskDataObj);
    }

    //send as argument to createTaskEl
}

// add buttons with unioque id 
var createTaskActions = function (taskId) {
    var actionContainerEl = document.createElement("div");
    actionContainerEl.className = "task-actions";

    //create edit button
    var editButtonEl = document.createElement("button");
    editButtonEl.textContent = "Edit";
    editButtonEl.className = "btn edit-btn";
    editButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(editButtonEl);

    // create delete button
    var deleteButtonEl = document.createElement("button");
    deleteButtonEl.textContent = "Delete";
    deleteButtonEl.className = "btn delete-btn";
    deleteButtonEl.setAttribute("data-task-id", taskId);

    actionContainerEl.appendChild(deleteButtonEl);

    var statusSelectEl = document.createElement("select");
    statusSelectEl.className = "select-status";
    statusSelectEl.setAttribute("name", "status-change");
    statusSelectEl.setAttribute("data-task-id", taskId);

    //Status Array for dropdown option on dynamic generated select button
    var statusChoices = ["To Do", "In Progress", "Completed"];

    actionContainerEl.appendChild(statusSelectEl);
    for (var i = 0; i < statusChoices.length; i++) {
        // create option element
        var statusOptionEl = document.createElement("option");
        statusOptionEl.textContent = statusChoices[i];
        statusOptionEl.setAttribute("value", statusChoices[i]);

        // append to select
        statusSelectEl.appendChild(statusOptionEl);
    }

    return actionContainerEl;
}

// Create new task function on submit
var createTaskEl = function (taskDataObj) {

    // creates <li> item
    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";

    // add task id as a custom attribute
    listItemEl.setAttribute("data-task-id", taskIdCounter);
    listItemEl.setAttribute("draggable", "true")

    //create and append div and h3 for task. Task box in column with values from form (vars)
    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = 'task-info';
    taskInfoEl.innerHTML = "<h3 class = 'task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
    listItemEl.appendChild(taskInfoEl);

    taskDataObj.id = taskIdCounter;

    tasks.push(taskDataObj);

    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);

    // add task to list (has value from input and div with HTM elemnts(to be formatted by CSS) with type from select inside)
    tasksToDoEl.appendChild(listItemEl);

    //increment task counter for next unique ID
    taskIdCounter++;

    saveTasks();
}


var deleteTask = function (taskId) {
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
    taskSelected.remove();

    // on delete create new array, cycle through tasks array and update new array with all tasks EXCEPT deleted tasks
    var updatedTaskArr = [];
    for (var i = 0; i <tasks.length; i++ ){
        if (tasks[i].id !== parseInt(taskId)){
            updatedTaskArr.push(tasks[i]);
        }
    }

    // reassign the new array as the tasks array (won't have deleted task)
    tasks = updatedTaskArr;

    saveTasks();
};

var taskButtonHandler = function (event) {
    var targetEl = event.target;

    if (targetEl.matches(".edit-btn")) {
        var taskId = targetEl.getAttribute("Data-task-id");
        editTask(taskId);
    } else if (
        event.target.matches(".delete-btn")) {
        var taskId = targetEl.getAttribute("data-task-id");
        deleteTask(taskId);
    }
};

var editTask = function (taskId) {
    // get task list item element
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

    //get content from task name and type
    var taskName = taskSelected.querySelector("h3.task-name").textContent;
    var taskType = taskSelected.querySelector("span.task-type").textContent;

    //update values of input field 
    document.querySelector("input[name='task-name']").value = taskName;
    document.querySelector("select[name='task-type']").value = taskType;

    //change 'add task' button to 'save task'
    document.querySelector("#save-task").textContent = "Save Task";

    //assign from id to edited task
    formEl.setAttribute("data-task-id", taskId);

};

var taskStatusChangeHandler = function (event) {
    // get task item's id
    var taskId = event.target.getAttribute("data-task-id");

    //get the currently selected option value and conver to lowercase
    var statusValue = event.target.value.toLowerCase();

    //find parent task item based on id
    var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");


    //column conditional -assign task as child based on taskSelected (event handler)
    if (statusValue === "to do") {
        tasksToDoEl.appendChild(taskSelected);
    } else if (statusValue === "in progress") {
        tasksInProgressEl.appendChild(taskSelected);
    } else if (statusValue === "completed") {
        tasksCompletedEl.appendChild(taskSelected);
    };

    // EDIT STATUS THROUGH DROPDOWN
    //update task status value in tasks array
    for (var i=0; i< tasks.length; i++){
        if (tasks[i].id === parseInt(taskId)){
            tasks[i].status = statusValue;
        };
    };

    saveTasks();
}

var dragTaskHandler = function (event) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);

    var getId = event.dataTransfer.getData("text/plain");
    // console.log("getId:", getId, typeof getId);

};

var dropZoneDragHandler = function (event) {
    var taskListEl = event.target.closest(".task-list");
    if (taskListEl) {
        event.preventDefault();
        taskListEl.setAttribute("style", "background: rgba(68, 233, 255, 0.7); border-style: dashed;");
    }
};

var dropTaskHandler = function (event) {
    var id = event.dataTransfer.getData("text/plain");
    var draggableElement = document.querySelector("[data-task-id= '" + id + "']");
    var dropZoneEl = event.target.closest(".task-list");
    var statusType = dropZoneEl.id;

    // set status of task based on dropzone id
    var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

    if (statusType === 'tasks-to-do') {
        statusSelectEl.selectedIndex = 0;
    }
    else if (statusType === 'tasks-in-progress') {
        statusSelectEl.selectedIndex = 1;
    }
    else if (statusType === "tasks-completed") {
        statusSelectEl.selectedIndex = 2;
    };

    dropZoneEl.removeAttribute("style");
    dropZoneEl.appendChild(draggableElement);


    for (var i = 0; i<tasks.length; i++){
        if (tasks[i].id === parseInt(id)) {
            tasks[i].status = statusSelectEl.value.toLowerCase();
        }
    };

    saveTasks();

};

var dragLeaveHandler = function(event){
    var taskListEl =event.target.closest(".task-list");
    if (taskListEl) {
        taskListEl.removeAttribute("style");
    }
};



var saveTasks = function () {
    localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
    // pulls tasks parameters ("key", value) from local storage (as string)
    var gotTasks = localStorage.getItem("tasks", tasks);
    // console.log("gotTasks:", gotTasks);
    
    // convert string obj to JSON
    tasks = JSON.parse(gotTasks);
    console.log(tasks)
    
    //iterate through JSON array pulled from local to create DOM element tasks
    for (var i = 0; i < tasks.length; i++) {
        tasks[i].id =taskIdCounter;
        console.log(tasks[i]);
        
        var listItemEl = document.createElement("li");
        listItemEl.className = "task-item";
        
        listItemEl.setAttribute("data-task-id", tasks[i].id);
        listItemEl.setAttribute("draggable", "true");
        // console.log(listItemEl);
        
        var taskInfoEl = document.createElement("div");
        taskInfoEl.className = 'task-info';
        taskInfoEl.innerHTML = "<h3 class='task-name'>" + tasks[i].name + "</h3><span class='task-type'>" + tasks[i].type + "</span>";
        listItemEl.appendChild(taskInfoEl);
        
        var taskActionsEl = createTaskActions(tasks[i].id);
        
        listItemEl.appendChild(taskActionsEl);
        
        if (tasks[i].status === "to do"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
            tasksToDoEl.appendChild(listItemEl);
        } 
        else if (tasks[i].status === "in progress"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
            tasksInProgressEl.appendChild(listItemEl);

        } 
        else if (tasks[i].status === "completed"){
            listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
            tasksCompletedEl.appendChild(listItemEl);
        };
        
        taskIdCounter++;
        console.log(listItemEl);
        
    };
};

loadTasks();

formEl.addEventListener("submit", taskFormHandler);
pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);
pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler);
pageContentEl.addEventListener("dragleave", dragLeaveHandler);
