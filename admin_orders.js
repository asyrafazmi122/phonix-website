document.addEventListener('DOMContentLoaded', function() {
  let currentOrderId = null;
  const deleteModal = document.getElementById('deleteModal');
  const confirmDeleteBtn = document.getElementById('confirmDelete');
  const cancelDeleteBtn = document.getElementById('cancelDelete');

  // Load orders data
  loadOrders();

  // Modal event listeners
  confirmDeleteBtn.addEventListener('click', function() {
    if (currentOrderId) {
      deleteOrder(currentOrderId);
    }
    deleteModal.style.display = 'none';
  });

  cancelDeleteBtn.addEventListener('click', function() {
    deleteModal.style.display = 'none';
    currentOrderId = null;
  });

  function loadOrders() {
    fetch('fetch_orders.php')
      .then(response => response.json())
      .then(data => {
        const tableBody = document.getElementById('orders-data');
        
        if (data.error) {
          tableBody.innerHTML = `<tr><td colspan="10">${data.error}</td></tr>`;
          return;
        }

        if (data.length === 0) {
          tableBody.innerHTML = '<tr><td colspan="10">No orders found</td></tr>';
          return;
        }

        let html = '';
        data.forEach(order => {
          const paymentClass = order.payment_method === 'credit-card' ? 'credit-card' : 'paypal';
          const paymentText = order.payment_method === 'credit-card' ? 'Credit Card' : 'PayPal';
          const orderDate = new Date(order.order_date).toLocaleString();

          html += `
            <tr data-order-id="${order.order_id}">
              <td>${order.order_id}</td>
              <td class="editable" data-field="phone_model">${order.phone_model}</td>
              <td class="editable" data-field="quantity">${order.quantity}</td>
              <td>RM${order.total_price.toFixed(2)}</td>
              <td>
                <select class="payment-select" data-field="payment_method">
                  <option value="credit-card" ${order.payment_method === 'credit-card' ? 'selected' : ''}>Credit Card</option>
                  <option value="paypal" ${order.payment_method === 'paypal' ? 'selected' : ''}>PayPal</option>
                </select>
              </td>
              <td class="editable" data-field="customer_name">${order.customer_name}</td>
              <td class="editable" data-field="customer_phone">${order.customer_phone}</td>
              <td class="editable" data-field="customer_email">${order.customer_email}</td>
              <td>${orderDate}</td>
              <td class="actions-cell">
                <button class="save-btn" style="display:none;">Save</button>
                <button class="edit-btn">Edit</button>
                <button class="delete-btn">Delete</button>
              </td>
            </tr>
          `;
        });

        tableBody.innerHTML = html;
        setupEventListeners();
      })
      .catch(error => {
        console.error('Error:', error);
        document.getElementById('orders-data').innerHTML = 
          '<tr><td colspan="10">Error loading data</td></tr>';
      });
  }

  function setupEventListeners() {
    // Edit button handlers
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const row = this.closest('tr');
        row.querySelectorAll('.editable').forEach(cell => {
          const currentValue = cell.textContent;
          cell.innerHTML = `<input type="text" value="${currentValue}">`;
        });
        row.querySelector('.edit-btn').style.display = 'none';
        row.querySelector('.delete-btn').style.display = 'none';
        row.querySelector('.save-btn').style.display = 'inline-block';
      });
    });

    // Save button handlers
    document.querySelectorAll('.save-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const row = this.closest('tr');
        const orderId = row.dataset.orderId;
        const updatedData = {
          order_id: orderId,
          phone_model: row.querySelector('[data-field="phone_model"] input').value,
          quantity: row.querySelector('[data-field="quantity"] input').value,
          payment_method: row.querySelector('[data-field="payment_method"]').value,
          customer_name: row.querySelector('[data-field="customer_name"] input').value,
          customer_phone: row.querySelector('[data-field="customer_phone"] input').value,
          customer_email: row.querySelector('[data-field="customer_email"] input').value
        };

        updateOrder(orderId, updatedData, row);
      });
    });

    // Delete button handlers
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const row = this.closest('tr');
        currentOrderId = row.dataset.orderId;
        deleteModal.style.display = 'block';
      });
    });
  }

  function updateOrder(orderId, data, row) {
    fetch('update_order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data)
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        // Update UI with saved values
        row.querySelector('[data-field="phone_model"]').textContent = data.phone_model;
        row.querySelector('[data-field="quantity"]').textContent = data.quantity;
        row.querySelector('[data-field="payment_method"]').textContent = 
          data.payment_method === 'credit-card' ? 'Credit Card' : 'PayPal';
        row.querySelector('[data-field="customer_name"]').textContent = data.customer_name;
        row.querySelector('[data-field="customer_phone"]').textContent = data.customer_phone;
        row.querySelector('[data-field="customer_email"]').textContent = data.customer_email;
        
        row.querySelector('.edit-btn').style.display = 'inline-block';
        row.querySelector('.delete-btn').style.display = 'inline-block';
        row.querySelector('.save-btn').style.display = 'none';
        
        showNotification('Order updated successfully!', 'success');
      } else {
        showNotification('Error updating order: ' + result.message, 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showNotification('Error updating order. Please try again.', 'error');
    });
  }

  function deleteOrder(orderId) {
    fetch('delete_order.php', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ order_id: orderId })
    })
    .then(response => response.json())
    .then(result => {
      if (result.success) {
        document.querySelector(`tr[data-order-id="${orderId}"]`).remove();
        showNotification('Order deleted successfully!', 'success');
      } else {
        showNotification('Error deleting order: ' + result.message, 'error');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      showNotification('Error deleting order. Please try again.', 'error');
    });
  }

  function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    document.body.appendChild(notification);
    
    setTimeout(() => {
      notification.remove();
    }, 3000);
  }
});