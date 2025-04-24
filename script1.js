// JavaScript for Shopping Cart and Checkout Validation

document.addEventListener("DOMContentLoaded", () => {
  // Update subtotal and total
  const updateCartTotal = () => {
    const rows = document.querySelectorAll("tbody tr");
    let subtotal = 0;

    rows.forEach(row => {
      const price = parseFloat(row.getAttribute("data-price"));
      const quantity = parseInt(row.querySelector("input").value, 10);
      const total = price * quantity;
      row.querySelector(".total-price").textContent = `$${total.toFixed(2)}`;
      subtotal += total;
    });

    document.getElementById("subtotal").textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById("total").textContent = `$${subtotal.toFixed(2)}`;
  };

  // Quantity buttons
  const quantityButtons = document.querySelectorAll(".quantity button");
  quantityButtons.forEach(button => {
    button.addEventListener("click", (event) => {
      const input = event.target.parentElement.querySelector("input");
      let quantity = parseInt(input.value, 10);

      if (event.target.classList.contains("increase")) {
        quantity++;
      } else if (event.target.classList.contains("decrease") && quantity > 1) {
        quantity--;
      }

      input.value = quantity;
      updateCartTotal();
    });
  });

  // Checkout form validation
  document.getElementById("payment-form").addEventListener("submit", (event) => {
    event.preventDefault();
    const name = document.getElementById("card-name").value.trim();
    const cardNumber = document.getElementById("card-number").value.trim();
    const cvv = document.getElementById("cvv").value.trim();

    if (!name || !cardNumber || !cvv) {
      alert("Please fill in all the payment details.");
      return;
    }

    alert("Payment Successful!");
  });
});
