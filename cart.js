let shoppingCart = JSON.parse(localStorage.getItem("shoppingCart")) || [];

function addToCart(itemImage, itemName, itemSize, itemPrice, quantity) {
  const item = {
    image: itemImage,
    name: itemName,
    size: itemSize,
    price: itemPrice,
    quantity: quantity,
  };
  shoppingCart.push(item);

  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
}

const addToCartButtons = document.querySelectorAll(".button__item");

addToCartButtons.forEach((button) => {
  button.addEventListener("click", () => {

    const itemImage = document.querySelector(".item__left img").src;
    const itemName = document.querySelector(".item__desc-top h1").innerText;
    const itemSize = document.querySelector(".size h3").innerText;
    const itemPrice = parseFloat(
      document
        .querySelector(".item__desc-bottom-left h1")
        .innerText.replace(" р.", "")
    );
    const quantity =
      parseInt(document.querySelector(".input__item").value) || 1;


    addToCart(itemImage, itemName, itemSize, itemPrice, quantity);


    alert(`${quantity} ${itemName} added to the cart!`);
  });
});

function displayCart() {
  const cartContainer = document.querySelector(".cart__container");
  const cartButton = document.querySelector(".cart__button");
  let cartItemsHTML = "";
  
  if (shoppingCart.length === 0) {
    cartButton.style.display = 'none';
  } else {
    cartButton.style.display = 'block';
  }
  shoppingCart.forEach((item, index) => {
    cartItemsHTML += `
      <div class="card">
        <div class="card__left">
          <img src="${item.image}" alt="" />
        </div>
        <div class="card__right">
          <h1>${item.name} (${item.size})</h1>
          <div class="size">
            <p>Размер:</p>
            <h3>${item.size}</h3>
          </div>
          <div class="card__right-bottom">
            <div class="counter">
              <button class="button__item-min" onclick="updateQuantity(${index}, -1)">-</button>
              <input class="input__item" value="${
                item.quantity
              }" onchange="updateQuantity(${index}, 0, this.value)"/>
              <button class="button__item-pls" onclick="updateQuantity(${index}, 1)">+</button>
            </div>
            <h1>${item.price * item.quantity} р.</h1>
          </div>
        </div>
      </div>
    `;
  });

  cartContainer.innerHTML = cartItemsHTML;
  calculateTotal();
}

function removeItem(index) {
  shoppingCart.splice(index, 1);
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));
  displayCart();
}

function updateQuantity(index, change, newQuantity) {
  if (change) {
    shoppingCart[index].quantity += change;
  } else {
    shoppingCart[index].quantity = newQuantity;
  }

  if (shoppingCart[index].quantity < 1) {
    shoppingCart.splice(index, 1);
  }

  // Save the shopping cart array to localStorage
  localStorage.setItem("shoppingCart", JSON.stringify(shoppingCart));

  displayCart();
}

function calculateTotal() {
  let totalPrice = 0;

  shoppingCart.forEach((item) => {
    totalPrice += item.price * item.quantity;
  });

  // Format the total price as a string with thousand separators
  const formattedTotalPrice = totalPrice.toLocaleString("ru-RU", {
    style: "currency",
    currency: "RUB",
  });

  // Update the cart sum element and return the formatted total price
  cartSum.querySelector("h1").innerText = formattedTotalPrice;
  return formattedTotalPrice;
}

const cartSum = document.querySelector(".cart__sum");

function addCartToForm() {
  const textarea = document.getElementById("list");
  textarea.value = shoppingCart
    .map((item) => {
      return ` Позиция: ${item.name}, Размер: ${item.size}, Цена/шт.: ${item.price}, Колличество: ${item.quantity}`;
    })
    .join("\n");

  // Add the total sum of the order to the text area
  textarea.value += `\nИтог: ${calculateTotal()}`;
}

// Call the function when the form is submitted
const form = document.querySelector("form");
form.addEventListener("submit", (event) => {
  event.preventDefault();
  addCartToForm();
  form.submit();
});

displayCart();
