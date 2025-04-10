document.addEventListener('DOMContentLoaded', () => {
    // Task Button Handler
    const newTaskButton = document.getElementById('newTaskButton');
    newTaskButton.addEventListener('click', () => {
      // Create the modal for adding a new task
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50';
      modal.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-lg relative w-full max-w-md">
          <button id="closeTaskModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
          <h2 class="text-2xl font-bold mb-4">Create New Task</h2>
          <form id="taskForm" class="space-y-4">
            <div>
              <label for="taskName" class="block text-sm font-medium text-gray-700">Task Name</label>
              <input type="text" id="taskName" class="w-full p-2 border border-gray-300 rounded-lg" required>
            </div>
            <div>
              <label for="taskDescription" class="block text-sm font-medium text-gray-700">Description</label>
              <textarea id="taskDescription" class="w-full p-2 border border-gray-300 rounded-lg" rows="3"></textarea>
            </div>
            <div>
              <label for="taskDueDate" class="block text-sm font-medium text-gray-700">Due Date</label>
              <input type="date" id="taskDueDate" class="w-full p-2 border border-gray-300 rounded-lg">
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white p-3 rounded-lg">Add Task</button>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
  
      // Close modal handler
      document.getElementById('closeTaskModal').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
  
      // Handle task form submission
      document.getElementById('taskForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const taskName = document.getElementById('taskName').value.trim();
        const taskDescription = document.getElementById('taskDescription').value.trim();
        const taskDueDate = document.getElementById('taskDueDate').value;
  
        if (!taskName) {
          alert('Task name is required.');
          return;
        }
  
        // Create a task object (you can later store these in localStorage if needed)
        const task = { taskName, taskDescription, taskDueDate };
  
        // Add the task to the task list UI
        addTaskToList(task);
  
        // Close the modal
        document.body.removeChild(modal);
      });
    });
  
    // Function to add a task to the task list
    function addTaskToList(task) {
      const taskListContainer = document.getElementById('taskList');
      const ul = taskListContainer.querySelector('ul');
  
      // Create a new list item for the task
      const li = document.createElement('li');
      li.className = 'bg-gray-50 p-3 rounded flex justify-between items-center transition-transform duration-300 hover:scale-105';
      li.innerHTML = `
        <div>
          <p class="font-medium">${task.taskName}</p>
          <p class="text-sm text-gray-500">${task.taskDescription ? task.taskDescription + ' ' : ''}${task.taskDueDate ? '- Due: ' + task.taskDueDate : ''}</p>
        </div>
        <button class="deleteTask text-red-500 hover:text-red-700" title="Delete Task">
          <i class="fas fa-trash-alt"></i>
        </button>
      `;
  
      // Delete task functionality
      li.querySelector('.deleteTask').addEventListener('click', () => {
        if (confirm('Delete this task?')) {
          ul.removeChild(li);
        }
      });
  
      // Append the new task to the list
      ul.appendChild(li);
    }
  });
  