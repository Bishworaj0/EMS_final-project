document.addEventListener('DOMContentLoaded', () => {
    // 1) Load existing accounts from localStorage
    let accounts = JSON.parse(localStorage.getItem('accounts')) || [];
  
    // 2) On-page elements
    const accountsList = document.getElementById('accountsList');
    const newAccountBtn = document.getElementById('newAccountBtn');
  
    // 3) Display any existing accounts
    updateAccountsList();
  
    // 4) "New Account" button => open the modal
    if (newAccountBtn) {
      newAccountBtn.addEventListener('click', openAccountModal);
    }
  
    // --- FUNCTIONS ---
  
    // A. OPEN ACCOUNT MODAL
    function openAccountModal(existingAccountIndex = null) {
      // If existingAccountIndex is not null, we're editing an existing account
      const isEditing = existingAccountIndex !== null;
      const accountToEdit = isEditing ? accounts[existingAccountIndex] : null;
  
      const modal = document.createElement('div');
      modal.className = 'fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50';
      modal.innerHTML = `
        <div class="bg-white p-6 rounded-xl shadow-lg relative max-w-md w-full mx-4">
          <button id="closeAccountModal" class="absolute top-4 right-4 text-gray-500 hover:text-gray-700">
            <i class="fas fa-times"></i>
          </button>
          <h2 class="text-2xl font-bold text-gray-800 mb-4 text-center">${isEditing ? 'Edit Account' : 'New Account'}</h2>
          <form id="accountForm" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Account Name</label>
              <input type="text" id="accountName" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Savings Account" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Account Type</label>
              <input type="text" id="accountType" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. Checking, Savings, Credit" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Balance</label>
              <input type="number" step="0.01" id="accountBalance" class="w-full p-2 border border-gray-300 rounded-lg" placeholder="e.g. 1000.00" required>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Notes (Optional)</label>
              <textarea id="accountNotes" class="w-full p-2 border border-gray-300 rounded-lg" rows="3" placeholder="Additional info..."></textarea>
            </div>
            <button type="submit" class="w-full bg-green-600 hover:bg-green-700 text-white py-2 rounded-lg">
              ${isEditing ? 'Save Changes' : 'Add Account'}
            </button>
          </form>
        </div>
      `;
      document.body.appendChild(modal);
  
      // B. Close the modal
      document.getElementById('closeAccountModal').addEventListener('click', () => {
        document.body.removeChild(modal);
      });
  
      // C. If editing, prefill the form with existing account data
      if (isEditing && accountToEdit) {
        document.getElementById('accountName').value = accountToEdit.name;
        document.getElementById('accountType').value = accountToEdit.type;
        document.getElementById('accountBalance').value = accountToEdit.balance;
        document.getElementById('accountNotes').value = accountToEdit.notes;
      }
  
      // D. Handle form submission (add or save changes)
      document.getElementById('accountForm').addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('accountName').value.trim();
        const type = document.getElementById('accountType').value.trim();
        const balance = parseFloat(document.getElementById('accountBalance').value);
        const notes = document.getElementById('accountNotes').value.trim();
  
        if (!name || !type || isNaN(balance)) {
          alert('Please fill out the required fields correctly.');
          return;
        }
  
        if (isEditing && accountToEdit) {
          // Overwrite existing record
          accounts[existingAccountIndex] = {
            ...accountToEdit,
            name, type, balance, notes
          };
          alert('Account updated successfully!');
        } else {
          // Create new account
          const newAccount = {
            id: Date.now(),
            name,
            type,
            balance,
            notes
          };
          accounts.push(newAccount);
          alert('Account added successfully!');
        }
  
        localStorage.setItem('accounts', JSON.stringify(accounts));
        updateAccountsList();
        document.body.removeChild(modal);
      });
    }
  
    // E. UPDATE ACCOUNTS LIST on the page
    function updateAccountsList() {
      accountsList.innerHTML = '';
      if (accounts.length === 0) {
        accountsList.innerHTML = `<li class="text-gray-500">No accounts found.</li>`;
        return;
      }
      accounts.forEach((account, index) => {
        const li = document.createElement('li');
        li.className = 'bg-gray-50 p-3 rounded flex justify-between items-center transition-transform duration-300 hover:scale-105';
  
        li.innerHTML = `
          <div>
            <p class="font-medium">${account.name}</p>
            <p class="text-sm text-gray-500">${account.type}</p>
            <p class="text-sm text-gray-700">Balance: $${account.balance.toFixed(2)}</p>
            ${account.notes ? `<p class="text-sm text-gray-600 mt-1">${account.notes}</p>` : ''}
          </div>
          <div class="flex items-center space-x-3">
            <button class="editAccount text-blue-500 hover:text-blue-700" title="Edit">
              <i class="fas fa-edit"></i>
            </button>
            <button class="deleteAccount text-red-500 hover:text-red-700" title="Delete">
              <i class="fas fa-trash-alt"></i>
            </button>
          </div>
        `;
  
        // Edit account
        li.querySelector('.editAccount').addEventListener('click', () => {
          openAccountModal(index);
        });
  
        // Delete account
        li.querySelector('.deleteAccount').addEventListener('click', () => {
          if (confirm('Delete this account?')) {
            accounts.splice(index, 1);
            localStorage.setItem('accounts', JSON.stringify(accounts));
            updateAccountsList();
          }
        });
  
        accountsList.appendChild(li);
      });
    }
  });
  // Function to fetch all accounts from the backend
function fetchAccounts() {
  fetch('http://localhost:8888/ems_backend/index.php/accounts')
    .then(response => response.json())
    .then(data => {
      console.log("Accounts data:", data);
      // Update your HTML to display accounts data
      // For example, loop over data and add rows to a table or cards to a grid
    })
    .catch(error => console.error("Error fetching accounts:", error));
}

// Function to create a new account
function createAccount(accountData) {
  fetch('http://localhost:8888/ems_backend/index.php/accounts', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(accountData)
  })
    .then(response => response.json())
    .then(data => {
      console.log("Account created:", data);
      fetchAccounts(); // Refresh the accounts list
    })
    .catch(error => console.error("Error creating account:", error));
}

// Call fetchAccounts when the page loads
document.addEventListener('DOMContentLoaded', () => {
  fetchAccounts();
});
  