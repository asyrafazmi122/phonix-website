document.addEventListener("DOMContentLoaded", function() {
  // Initialize cart
  updateCartTotal();
  setupQuantityControls();
  setupCheckoutForm();
});

// Cart Functions
function updateCartTotal() {
  const row = document.querySelector("tbody tr");
  const price = parseFloat(row.getAttribute("data-price"));
  const quantity = parseInt(row.querySelector("input").value);
  const total = price * quantity;
  
  row.querySelector(".total-price").textContent = `RM${total.toFixed(2)}`;
  document.getElementById("subtotal").textContent = `RM${total.toFixed(2)}`;
  document.getElementById("total").textContent = `RM${total.toFixed(2)}`;
}

function setupQuantityControls() {
  const quantityInput = document.querySelector(".quantity input");
  const increaseBtn = document.querySelector(".quantity .increase");
  const decreaseBtn = document.querySelector(".quantity .decrease");

  quantityInput.addEventListener("change", function() {
    if (this.value < 1) this.value = 1;
    updateCartTotal();
  });

  increaseBtn.addEventListener("click", function() {
    quantityInput.value = parseInt(quantityInput.value) + 1;
    updateCartTotal();
  });

  decreaseBtn.addEventListener("click", function() {
    if (quantityInput.value > 1) {
      quantityInput.value = parseInt(quantityInput.value) - 1;
      updateCartTotal();
    }
  });
}

// Checkout Functions
function setupCheckoutForm() {
  const form = document.getElementById("payment-form");
  
  form.addEventListener("submit", async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = {
      phone_model: document.querySelector("select").value,
      quantity: document.querySelector(".quantity input").value,
      total_price: document.getElementById("total").textContent.replace('RM', ''),
      payment_method: document.querySelector("input[name='payment']:checked").value,
      customer_name: document.getElementById("full-name").value.trim(),
      customer_phone: document.getElementById("phone-number").value.trim(),
      customer_email: document.getElementById("email").value.trim()
    };

    // Validate
    if (!validateForm(formData)) return;

    // Submit
    try {
      const response = await fetch('save_order.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      const result = await response.json();
      
      if (result.success) {
        showOrderConfirmation(result.order_id, formData);
      } else {
        showError(result.message);
      }
    } catch (error) {
      showError("Network error. Please try again.");
    }
  });
}

function validateForm(data) {
  clearErrors();
  
  // Required fields
  if (!data.customer_name) {
    showError("Full name is required", "full-name");
    return false;
  }
  
  if (!data.customer_phone) {
    showError("Phone number is required", "phone-number");
    return false;
  } else if (!/^(\+?6?01)[0-46-9][- ]?[0-9]{7,8}$/.test(data.customer_phone)) {
    showError("Invalid Malaysian phone number", "phone-number");
    return false;
  }
  
  if (!data.customer_email) {
    showError("Email is required", "email");
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.customer_email)) {
    showError("Invalid email address", "email");
    return false;
  }
  
  return true;
}

function showError(message, fieldId = null) {
  const errorElement = document.createElement('div');
  errorElement.className = 'error-message';
  errorElement.style.color = 'red';
  errorElement.style.margin = '5px 0';
  errorElement.textContent = message;
  
  if (fieldId) {
    document.getElementById(fieldId).parentNode.appendChild(errorElement);
  } else {
    document.querySelector(".payment-info").prepend(errorElement);
  }
  
  setTimeout(() => errorElement.remove(), 5000);
}

function clearErrors() {
  document.querySelectorAll('.error-message').forEach(el => el.remove());
}

function showOrderConfirmation(orderId, orderData) {
  document.querySelector(".payment-info").innerHTML = `
    <div class="confirmation">
      <h2>Order Confirmed!</h2>
      <div class="order-details">
        <p><strong>Order #:</strong> ${orderId}</p>
        <p><strong>Phone Model:</strong> ${orderData.phone_model}</p>
        <p><strong>Quantity:</strong> ${orderData.quantity}</p>
        <p><strong>Total Paid:</strong> RM${orderData.total_price}</p>
        <p><strong>Payment Method:</strong> ${orderData.payment_method === 'credit-card' ? 'Credit Card' : 'PayPal'}</p>
      </div>
      <div class="customer-details">
        <p><strong>Customer:</strong> ${orderData.customer_name}</p>
        <p><strong>Contact:</strong> ${orderData.customer_phone}</p>
        <p><strong>Email:</strong> ${orderData.customer_email}</p>
      </div>
      <p>Confirmation sent to ${orderData.customer_email}</p>
      <a href="product.html" class="continue-btn">Continue Shopping</a>
    </div>
  `;
  
  // Add confirmation styles
  const style = document.createElement('style');
  style.textContent = `
    .confirmation {
      text-align: center;
      padding: 25px;
      background: #f8f8f8;
      border-radius: 8px;
    }
    .order-details, .customer-details {
      text-align: left;
      margin: 20px 0;
      padding: 15px;
      background: white;
      border-radius: 5px;
    }
    .continue-btn {
      display: inline-block;
      margin-top: 15px;
      padding: 10px 20px;
      background: #7B7531;
      color: white;
      text-decoration: none;
      border-radius: 4px;
    }
  `;
  document.head.appendChild(style);
}