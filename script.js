//Object where all the calculation goes on
var todoList = {
    //TO-DO ARRAY: EVERY TO-DO IS HERE. EVERY TO-DO HAS TWO OBJECTS. 
    //ONE THAT HAS THE TEXT OF THE TO-DO AND ONE THAT SHOWS IF THE TO-DO
    //HAS BEEN COMPLETED.
    todos: [],
    //ADDS NEW TO-DO TO THE ARRAY
    addTodo: function (todoText) {
        this.todos.push({todoText:todoText, completed:false});        
    },
    //EDITS THE TO-DO IF NECESSARY
    changeTodo: function (position, todoText) {
        this.todos[position].todoText = todoText;   
    },
    //DELETE TO-DO FROM THE TODOS ARRAY
    deleteTodo: function (position) {
        this.todos.splice(position, 1); 
    },
    //IF OBJECTS MARKS THE COMPLETION OF THE TO-DOS
    toggleCompleted: function(position) {
        var todo = this.todos[position];
        todo.completed = !todo.completed;
    },
    //USER CAN TOGGLE ALL THE TO-DOS AT ONCE WITH THIS. EVERY TO-DO
    //CAN BE MARKED AS DONE OR DONE WITH ONE CLICK.
    toggleAll: function () {
        var totalTodos = this.todos.length;
        var jobCompleteCounter = 0;
        
        this.todos.forEach(function (todo) {
            if (todo.completed === true) {
                jobCompleteCounter++;                            
            }
        });
        
        this.todos.forEach(function (todo) {
            if (totalTodos === jobCompleteCounter) {
                todo.completed = false;
            } else {
                todo.completed = true;
            }
        })    
    },
    
};

//OBJECTS THAT HANDLES EVENTS
var handlers = {
    //WHEN USER ENTERS NEW TO-DO, THIS OBJECT IS TRIGGERED
    addTodo: function () {
        var addTodoTextInput = document.getElementById("new-todo");
        //CHECKS IF THE INPUT FIELD IS EMPTY OR NOT.
        //NECESSARY TO PREVENT AND EMPTY STRING TO GET IN THE TO-DO LIST
        if (/\w/g.test(addTodoTextInput.value)) {
            todoList.addTodo(addTodoTextInput.value);
            addTodoTextInput.value = '';
            view.displayTodos();
        }
    },
    //WHEN USER WANTS TO DELETE A TO-DO, THIS OBJECT IS TRIGGERED
    deleteTodo: function (position) {
        todoList.deleteTodo(position);
        view.displayTodos();    
    },
    //IF USER WANTS TO EDIT A TO-DO, THIS OBJECT IS TRIGGERED
    //THIS OPENS UP A INPUT FIELD IN THE USER INTERFACE 
    //TO EDIT THE TO-DO
    createEditorInputField: function (position) {
        var openInputFieldChecker = document.getElementById("edit_done");
        //PREVENTS MULTIPLE EDIT INPUT FIELD TO BE OPEN AT A TIME.
        if (openInputFieldChecker === null) {
            //IF NO OTHER EDIT INPUT FIELD IS OPEN, CREATES AN INPUT FIELD
            //FOR THE USER. 
            var editIdentifier = document.getElementById(position);
        
            var editField = document.createElement("input");
            editField.type = "text";
            editField.id = "editField";
            
            //CREATES THE DONE ICON
            var editConfirmer = document.createElement("i");
            editConfirmer.className = "ion-android-done";
            editConfirmer.id = "edit_done";

            editIdentifier.innerHTML = "";
            //APPENDING THE CHILD ELEMENTS INTO THE LI-LIST ELEMENT
            editIdentifier.appendChild(editField);
            editIdentifier.appendChild(editConfirmer);

            //SETS THE VALUE OF THE EDIT INPUT FIELD TO THE CURRENT VALUE.
            //PREVENTING USERS TO TYPE THE ENTIRE TO-DO FROM THE BEGINNING
            var editValue = document.getElementById("editField");
            editValue.value = todoList.todos[position].todoText;

            //MAKING THE ENTER BUTTON WORK FOR THE EDIT INPUT FIELD
            editValue.addEventListener("keyup", function (event) {
                if (event.keyCode === 13) {
                    document.getElementById("edit_done").click();
                }
            })
            //IF AN EDIT INPUT FIELD IS OPEN AND YET USER CLICKED ANOTHER 
            //EDIT BUTTON TO EDIT A TO-DO, THIS CODE TAKES THE VALUE OF THE PREVIOUSLY
            //OPENED INPUT FIELD BY TRIGGERING THE DONE-OK BUTTON AND THEN STARTS TO
            //EDIT THE NEW TO-DO
        } else {
            openInputFieldChecker.click();
            this.createEditorInputField(position);
        }
        
        
    },
    //THIS OBJECT FINALIZES EDITING OF THE TO-DO
    changeTodo: function (position, todoText) {
        todoList.changeTodo(position, todoText);
        view.displayTodos();
    },
    //TRIGGERED WHEN A TO-DO IS COMPLETED
    toggleCompleted: function(position) {
        todoList.toggleCompleted(position);
        view.displayTodos();
    },
    //TRIGGERED WHEN TOGGLE ALL BUTTON IS CLICKED
    toggleAll: function() {
        todoList.toggleAll();
        view.displayTodos();
    },
};

var view = {
    //THIS FUNCTION IS TRIGGERED EVERYTIME THERE IS AN EVENT-EDITING TO-DO, NEW TO-DO. 
    //OUTPUTS THE CURRENT SITUATION OF THE TO-DO
    displayTodos: function () {
        var todosUl = document.querySelector("ul");
        todosUl.innerHTML = "";
        
        var toggleAllVisibility = document.getElementById("toggleAllId")
        //BELOW CODE MAKES THE TOGGLE ALL BUTTON VISIBLE WHEN THERE IS 
        //TWO OR MORE TO-DO IN THE LIST. IF THERE IS LESS OR NO TO-DO
        //TOGGLE ALL BUTTON WILL NOT BE VISIBLE
        if (todoList.todos.length > 1) {
            toggleAllVisibility.className = "toggle-all";
        } else {
            toggleAllVisibility.className = "toggle-all-hidden";
        }
                
        todoList.todos.forEach(function (todo, position) {
            var todoLi = document.createElement("li");
            todoLi.id = position;
//            todoLi.textContent = todo.todoText;
            
            
            var toggleChecker = this.createToggleButton();
            //IF ONE TO-DO IS COMPLETED, THAT WILL BE MARKED AS DONE
            //BY SHOWING A HORIZONTAL LINE OVER THE TO-DO TEXT.
            //THIS WAS ACHIEVED BY APPENDING A 'S' ELEMENT IN THE TO-DO LIST
            // THAT WERE COMPLETED
            var crossOutFinishedTodo = document.createElement("s");
            
            if (todo.completed === true) {
                toggleChecker.checked = true;
                crossOutFinishedTodo.textContent = todo.todoText;
                todoLi.appendChild(crossOutFinishedTodo);
                
            } else {
                toggleChecker.checked = false;
                todoLi.textContent = todo.todoText;
            }
            
            todoLi.appendChild(this.createDeleteButton());
            todoLi.appendChild(this.createChangeButton());
            
            todoLi.prepend(toggleChecker);
            todosUl.appendChild(todoLi);            
        }, this);
    },    
    //CREATES THE TO-DO DELETE BUTTON
    createDeleteButton: function () {
        var deleteButton = document.createElement("i");

        deleteButton.className = "ion-close-round";
        return deleteButton;
    
    },
    //CREATES THE TO-DO EDIT BUTTON
    createChangeButton: function () {
        var changeButton = document.createElement("i");
        
        changeButton.className = "ion-edit";
        return changeButton;
    },
    //CREATES THE CHECKBOXES TO MARK IN CASE THE TO-DO WAS COMPLETED
    createToggleButton: function() {
        var toggleButton = document.createElement("input");
        toggleButton.type = "checkbox";
        toggleButton.className = "toggleButton";
        return toggleButton;
        return toggleButton;
    },
    //LISTENS TO EVENTS HAPPENING INSIDE THE UNORDERED TO-DO LIST
    setUpEventListener: function() {
        var todosUl = document.querySelector("ul");
        
        todosUl.addEventListener("click", function(event) {
            var elementClicked = event.target;
            
            if (elementClicked.className === "ion-close-round") {
                handlers.deleteTodo(parseInt(elementClicked.parentNode.id));
            } else if (elementClicked.className === "ion-edit") {
                handlers.createEditorInputField(parseInt(elementClicked.parentNode.id));
            } else if (elementClicked.className === "ion-android-done") {
                var editTodoTextInput = document.getElementById("editField");
                handlers.changeTodo(parseInt(elementClicked.parentNode.id), editTodoTextInput.value);
            } else if (elementClicked.className === "toggleButton") {
                handlers.toggleCompleted(parseInt(elementClicked.parentNode.id));
            }
        });
        
        //MAKING THE ENTER KEY WORK FOR THE ADD TO-DO INPUT FIELD
        var addTodoInputGetter = document.getElementById("new-todo");
        addTodoInputGetter.addEventListener("keyup", function(event) {
            if (event.keyCode === 13) {
                handlers.addTodo();
            }
        })
    },
    //SHOWS THE CURRENT DATE
    setTheDate: function () {
        var d = new Date();
        var dateTarget = document.getElementById("date-para");
        dateTarget.innerHTML = d.getDate() + "/" + (d.getMonth()+1) + "/" + d.getFullYear(); 
    },
};
//CALLING THE EVENT LISTENER & DATE FUNCTIONS TO WORK    
view.setUpEventListener();
view.setTheDate();































