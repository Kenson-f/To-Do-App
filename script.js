document.addEventListener('DOMContentLoaded', () => {
    // DOM Element References
    const addTaskForm = document.getElementById('add-task-form');
    const taskInput = document.getElementById('task-input');
    const pendingTasksList = document.getElementById('pending-tasks-list');
    const completedTasksList = document.getElementById('completed-tasks-list');
    const dateDisplay = document.getElementById('date-display');
    const encouragementMessage = document.getElementById('encouragement');

    // Display current date
    const today = new Date();
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    dateDisplay.textContent = today.toLocaleDateString('en-US', options);

    // Encouragement messages for a fun touch
    const encouragementQuotes = [
        "Great job!", "Keep up the amazing work!", "You're on a roll!",
        "One step closer to your goals!", "Fantastic progress!", "You're crushing it!"
    ];

    // Load tasks from localStorage or initialize an empty array
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    // Function to save tasks to localStorage
    const saveTasks = () => {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    };

    // Function to render tasks to the DOM
    const renderTasks = () => {
        pendingTasksList.innerHTML = '';
        completedTasksList.innerHTML = '';

        if (tasks.length === 0) {
            pendingTasksList.innerHTML = '<p style="text-align:center; opacity: 0.7;">Your task list is empty. Add a task to get started!</p>';
        }

        tasks.forEach(task => {
            const taskItem = createTaskElement(task);
            if (task.completed) {
                completedTasksList.appendChild(taskItem);
            } else {
                pendingTasksList.appendChild(taskItem);
            }
        });
        updateEncouragement();
    };

    // Function to show a random encouragement message
    const showEncouragement = () => {
        const randomIndex = Math.floor(Math.random() * encouragementQuotes.length);
        encouragementMessage.textContent = encouragementQuotes[randomIndex];
        encouragementMessage.style.opacity = '1';
        setTimeout(() => {
            encouragementMessage.style.opacity = '0';
        }, 2000);
    };

    // Hide encouragement message if no tasks are completed
    const updateEncouragement = () => {
        if (completedTasksList.children.length === 0) {
            encouragementMessage.style.opacity = '0';
        }
    };

    // Function to create a single task list item element
    const createTaskElement = (task) => {
        const li = document.createElement('li');
        li.className = 'task-item';
        li.dataset.id = task.id;

        if (task.completed) {
            li.classList.add('completed');
        }

        const taskText = document.createElement('span');
        taskText.textContent = task.text;

        const buttonsWrapper = document.createElement('div');
        buttonsWrapper.className = 'task-actions';

        // Complete/Undo Button
        const completeButton = document.createElement('button');
        completeButton.innerHTML = task.completed
            ? `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="color: #f1c40f;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" /></svg>` // Undo Icon
            : `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="color: #2ecc71;"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>`; // Complete Icon
        completeButton.onclick = () => toggleComplete(task.id);

        // Delete Button
        const deleteButton = document.createElement('button');
        deleteButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" style="color: #e74c3c;"><path stroke-linecap="round" stroke-linejoin="round" d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.134-2.033-2.134H8.033c-1.12 0-2.033.954-2.033 2.134v.916m7.5 0a48.667 48.667 0 00-7.5 0" /></svg>`; // Delete Icon
        deleteButton.onclick = () => deleteTask(task.id);

        li.appendChild(taskText);
        buttonsWrapper.appendChild(completeButton);
        buttonsWrapper.appendChild(deleteButton);
        li.appendChild(buttonsWrapper);

        return li;
    };

    // Function to add a new task
    const addTask = (text) => {
        if (text.trim() === '') {
            // Simple visual feedback for empty input
            taskInput.style.borderColor = '#e74c3c';
            setTimeout(() => { taskInput.style.borderColor = 'transparent'; }, 1000);
            return;
        }

        const newTask = {
            id: Date.now(),
            text: text,
            completed: false,
        };
        tasks.unshift(newTask); // Add to the beginning of the array
        saveTasks();
        renderTasks();
    };

    // Function to toggle a task's completed state
    const toggleComplete = (id) => {
        const task = tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                showEncouragement();
            }
            saveTasks();
            renderTasks();
        }
    };

    // Function to delete a task
    const deleteTask = (id) => {
        const taskElement = document.querySelector(`[data-id='${id}']`);
        if (taskElement) {
            taskElement.classList.add('removing');
            // Wait for animation to finish before removing from data and re-rendering
            setTimeout(() => {
                tasks = tasks.filter(t => t.id !== id);
                saveTasks();
                renderTasks();
            }, 300);
        }
    };

    // Event Listener for form submission
    addTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();
        addTask(taskInput.value);
        taskInput.value = '';
    });

    // Initial render of tasks on page load
    renderTasks();
});
