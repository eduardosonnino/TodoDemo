document.getElementById('newTaskInput').addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        e.preventDefault();
        var taskText = document.getElementById('newTaskInput').value;
        if (taskText.trim() !== '') {
            addTask(taskText, false);
            document.getElementById('newTaskInput').classList.add('animated', 'bounce');
        }
    }
});

var todos = JSON.parse(localStorage.getItem('todos')) || {
    today: [],
    week: {
        monday: [],
        tuesday: [],
        wednesday: [],
        thursday: [],
        friday: [],
        saturday: [],
        sunday: []
    },
    month: []
};

function addTask(taskText, completed) {
    var selectedMenu = document.querySelector('.menu-item.selected').id;
    var today = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    var newTask = { text: taskText, completed: completed };
    
    if (selectedMenu === "menu-today") {
        todos.today.push(newTask);
    } else if (selectedMenu === "menu-this-week") {
        todos.week[today].push(newTask);
    } else if (selectedMenu === "menu-this-month") {
        todos.month.push(newTask);
    }
    
    localStorage.setItem('todos', JSON.stringify(todos));
    createTaskElement(newTask, true);
    document.getElementById('newTaskInput').value = '';
    document.getElementById('newTaskInput').classList.remove('animated', 'bounce');
}

function createTaskElement(task, animate) {
    var li = document.createElement('li');
    li.className = 'todoItem';
    if (animate) {
        li.classList.add('todoItem-add', 'animated', 'slideInRight');
    }

    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = task.completed;
    checkbox.addEventListener('change', function() {
        if (this.checked) {
            task.completed = true;
            li.classList.add('completed');
            createConfetti();
        } else {
            task.completed = false;
            li.classList.remove('completed');
        }
        localStorage.setItem('todos', JSON.stringify(todos));
    });

    var text = document.createElement('span');
    text.textContent = task.text;
    text.contentEditable = "false";

    var deleteBtn = document.createElement('button');
    deleteBtn.textContent = "Delete";
    deleteBtn.className = "delete-button";
    deleteBtn.addEventListener('click', function() {
        li.classList.add('todoItem-remove', 'animated', 'slideOutRight');
        setTimeout(function() {
            li.remove();
            deleteTask(task);
            animateTasksUp();
        }, 1000);
    });

    li.appendChild(checkbox);
    li.appendChild(text);
    li.appendChild(deleteBtn);

    document.getElementById('todoList').appendChild(li);
}

function deleteTask(task) {
    var selectedMenu = document.querySelector('.menu-item.selected').id;
    var today = new Date().toLocaleString('en-US', { weekday: 'long' }).toLowerCase();
    
    if (selectedMenu === "menu-today") {
        var index = todos.today.findIndex(function (t) { return t.text === task.text; });
        todos.today.splice(index, 1);
    } else if (selectedMenu === "menu-this-week") {
        var index = todos.week[today].findIndex(function (t) { return t.text === task.text; });
        todos.week[today].splice(index, 1);
    } else if (selectedMenu === "menu-this-month") {
        var index = todos.month.findIndex(function (t) { return t.text === task.text; });
        todos.month.splice(index, 1);
    }
    
    localStorage.setItem('todos', JSON.stringify(todos));
}

function switchList(menuId) {
    var ul = document.getElementById('todoList');
    ul.innerHTML = "";

    switch(menuId) {
        case "menu-today":
            for (let todo of todos.today) {
                createTaskElement(todo, false);
            }
            break;
        case "menu-this-week":
            for (let day in todos.week) {
                for (let todo of todos.week[day]) {
                    createTaskElement(todo, false);
                }
            }
            break;
        case "menu-this-month":
            for (let todo of todos.month) {
                createTaskElement(todo, false);
            }
            break;
        default:
            break;
    }
}

function animateTasksUp() {
    var todoList = document.getElementById('todoList').children;
    for (var i = 0; i < todoList.length; i++) {
        todoList[i].classList.add('animated', 'slideInUp');
    }
}

function createConfetti() {
    confetti({
        particleCount: 100,
        startVelocity: 30,
        spread: 360,
        ticks: 60,
        origin: {
            y: 0.5
        }
    });
}

var menuItems = document.getElementsByClassName('menu-item');
for (var i = 0; i < menuItems.length; i++) {
    menuItems[i].addEventListener('click', function() {
        for (var j = 0; j < menuItems.length; j++) {
            menuItems[j].classList.remove('selected');
        }
        this.classList.add('selected');
        switchList(this.id);
    });
}

window.onload = function() {
    var today = new Date();
    var date = today.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    document.getElementById('dateToday').innerText = date;
    document.getElementById('menu-today').click();
};
