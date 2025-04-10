document.addEventListener('DOMContentLoaded', () => {
    console.log('Product Order Page Loaded');
  
    // Retrieve orders from localStorage or initialize as an empty array
    let orders = JSON.parse(localStorage.getItem('orders')) || [];
    console.log('Existing orders:', orders);
  
    // Get references to UI elements
    const ordersList = document.getElementById('orders');
    const orderCount = document.getElementById('orderCount');
    const emptyState = document.getElementById('emptyState');
  
    // Function to update the orders UI
    function updateOrdersUI() {
      console.log('Updating orders UI');
      orderCount.textContent = `${orders.length} order${orders.length !== 1 ? 's' : ''}`;
      ordersList.innerHTML = '';
  
      if (orders.length === 0) {
        emptyState.style.display = 'block';
      } else {
        emptyState.style.display = 'none';
        orders.forEach(order => {
          const li = document.createElement('li');
          // Add transition for a responsive feel
          li.className = 'bg-gray-50 p-4 rounded-lg flex justify-between items-center transition-transform duration-300 hover:scale-105';
          li.innerHTML = `
            <div>
              <span class="font-medium">${order.quantity} × ${order.product}</span>
              <span class="text-sm text-gray-500 ml-2">#${order.id}</span>
            </div>
            <div class="flex items-center space-x-3">
              <span class="text-sm text-gray-500">${new Date(order.date).toLocaleString()}</span>
              <button class="cancelOrder text-red-500 hover:text-red-700" title="Cancel Order">
                <i class="fas fa-times"></i>
              </button>
            </div>
          `;
          li.querySelector('.cancelOrder').addEventListener('click', () => {
            if (confirm('Are you sure you want to cancel this order?')) {
              orders = orders.filter(o => o.id !== order.id);
              localStorage.setItem('orders', JSON.stringify(orders));
              updateOrdersUI();
            }
          });
          ordersList.appendChild(li);
        });
      }
    }
  
    // Initial UI update on page load
    updateOrdersUI();
  
    // Handle new order form submission
    document.getElementById('orderForm').addEventListener('submit', (e) => {
      e.preventDefault();
  
      const productDropdown = document.getElementById('productDropdown');
      const quantityInput = document.getElementById('quantity');
      const product = productDropdown.value;
      const quantity = quantityInput.value;
  
      console.log('New order submission:', { product, quantity });
  
      if (!product || !quantity) {
        alert('Please select a product and specify a quantity.');
        return;
      }
  
      // Create a unique order using the current timestamp
      const order = {
        id: Date.now(),
        product,
        quantity,
        date: new Date().toISOString()
      };
  
      // Add the new order, save to localStorage, and update UI
      orders.push(order);
      localStorage.setItem('orders', JSON.stringify(orders));
      updateOrdersUI();
  
      // Reset the form fields for a better user experience
      e.target.reset();
      productDropdown.selectedIndex = 0;
      quantityInput.value = 1;
  
      alert('Order placed successfully!');
    });
  });
  