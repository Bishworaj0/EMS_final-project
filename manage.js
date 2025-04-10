document.querySelector('.sidebar-item:nth-child(3)').addEventListener('click', function () {
    // Create the modal container
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50';
    modal.innerHTML = `
      <div class="bg-white p-6 rounded-xl shadow-lg relative max-w-lg w-full mx-4">
        <button id="closeManageDataModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
          <i class="fas fa-times"></i>
        </button>
        <h3 class="text-2xl font-bold text-gray-800 mb-4 text-center">Manage Data</h3>
        <form id="dataForm" class="space-y-4">
          <div>
            <label for="dataName" class="block text-sm font-medium text-gray-700">Data Name</label>
            <input type="text" id="dataName" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Enter data name" required>
          </div>
          <div>
            <label for="dataValue" class="block text-sm font-medium text-gray-700">Data Value</label>
            <input type="text" id="dataValue" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="Enter data value" required>
          </div>
          <button type="submit" class="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg">Add Data</button>
        </form>
        <div id="dataList" class="mt-6">
          <h4 class="text-xl font-semibold text-gray-800 mb-2">Data Entries</h4>
          <ul id="entries" class="space-y-2"></ul>
        </div>
      </div>
    `;
    document.body.appendChild(modal);
  
    // Close modal event
    document.getElementById('closeManageDataModal').addEventListener('click', function () {
      document.body.removeChild(modal);
    });
  
    // Array to store data entries (persisted in localStorage)
    let dataEntries = JSON.parse(localStorage.getItem('dataEntries')) || [];
  
    // Function to update the entries list UI
    function updateEntries() {
      const entriesUl = document.getElementById('entries');
      entriesUl.innerHTML = '';
  
      if (dataEntries.length === 0) {
        entriesUl.innerHTML = `<li class="text-gray-500">No data entries found.</li>`;
      } else {
        dataEntries.forEach((entry, index) => {
          const li = document.createElement('li');
          li.className = 'flex justify-between items-center bg-gray-100 p-2 rounded transition-transform duration-300 hover:scale-105';
          li.innerHTML = `
            <div>
              <span class="font-medium">${entry.name}:</span>
              <span class="ml-2">${entry.value}</span>
            </div>
            <div class="flex space-x-2">
              <button class="editEntry text-yellow-600 hover:text-yellow-700" title="Edit">
                <i class="fas fa-edit"></i>
              </button>
              <button class="deleteEntry text-red-600 hover:text-red-700" title="Delete">
                <i class="fas fa-trash-alt"></i>
              </button>
            </div>
          `;
          // Edit functionality: load data into form and remove from list temporarily
          li.querySelector('.editEntry').addEventListener('click', function () {
            document.getElementById('dataName').value = entry.name;
            document.getElementById('dataValue').value = entry.value;
            dataEntries.splice(index, 1);
            localStorage.setItem('dataEntries', JSON.stringify(dataEntries));
            updateEntries();
          });
          // Delete functionality
          li.querySelector('.deleteEntry').addEventListener('click', function () {
            if (confirm('Delete this entry?')) {
              dataEntries.splice(index, 1);
              localStorage.setItem('dataEntries', JSON.stringify(dataEntries));
              updateEntries();
            }
          });
          entriesUl.appendChild(li);
        });
      }
    }
    updateEntries();
  
    // Handle form submission to add new data entry
    document.getElementById('dataForm').addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('dataName').value.trim();
      const value = document.getElementById('dataValue').value.trim();
      if (!name || !value) {
        alert('Please fill in both fields.');
        return;
      }
      const newEntry = { name, value };
      dataEntries.push(newEntry);
      localStorage.setItem('dataEntries', JSON.stringify(dataEntries));
      updateEntries();
      this.reset();
    });
  });
  