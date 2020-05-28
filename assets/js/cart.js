var alreadyOrdered = true;
var orderArray = []; //contains the user's order

//checks if the page has loaded
ready();

//if page is loaded, then event listeners are made for the buttons
function ready(){
  //making use of localStorage to keep track of user's order even if they leave the menu.html page
  if(localStorage.hasOwnProperty('order-input') == false && localStorage.hasOwnProperty('order-price-input') == false){
    console.log('localStorage not defined yet');
    alreadyOrdered = false;
    localStorage.setItem('order-input', null);
    localStorage.setItem('order-price-input', '0.00');
  }
  else {
    if(localStorage.getItem('order-input').indexOf("(") == -1){ //if there are no items in the order, then the user has not ordered
      console.log("here");
      localStorage.removeItem('order-input');
      localStorage.setItem('order-input', null);
      alreadyOrdered = false;
    }
    else{
      console.log("Pre-redefine localStorage", localStorage.getItem('order-input'));
      orderArray = localStorage.getItem('order-input').split(',');
    }
    console.log("refefine", orderArray.length);
    console.log(localStorage.getItem('order-input'));

    console.log(orderArray.length);

    outputCart();
  }

  if(!alreadyOrdered){
    document.getElementsByClassName('cart-text')[0].innerHTML = 'Your order will be displayed here when you add items.';
    document.getElementsByClassName('cart')[0].style.visibility = 'hidden';
  }
  var removeItemButtons = document.getElementsByClassName('text-danger');
  //when the "remove" button is clicked, the item is removed from the cart
  for (var i = 0; i < removeItemButtons.length; i++){
    var button = removeItemButtons[i];
    button.addEventListener('active', removeCartItem);
  }

  var quantityInputs = document.getElementsByClassName('cart-quantity-input');
  for (var i = 0; i < quantityInputs.length; i++){
    var input = quantityInputs[i];
    input.addEventListener('change', changeQuantity);
  }

  var addToCartButtons = document.getElementsByClassName('add-to-cart-button');
  for (var i = 0; i < addToCartButtons.length; i++){
    var button = addToCartButtons[i];
    button.addEventListener('click', addToCartClicked);
  }
}

//if the cart was already made, then the cart items will be outputted
function outputCart(){
  document.getElementById('order-input').value = localStorage.getItem('order-input');

  var names = localStorage.getItem('order-input').split(' ');
  for (var i = 1; i < names.length; i += 2){
    var item = document.getElementsByClassName(names[i])[0];

    //defines variables
    var shopItem = item.parentElement;
    var shopItem2 = item.parentElement.parentElement;
    var title = shopItem.getElementsByClassName('item-name')[0].innerText;
    var price = shopItem.getElementsByClassName('item-price')[0].innerText;
    var imageSrc = shopItem2.getElementsByClassName('menu-preview-image')[0].src;

    //gets the quantity of the item in the cart
    var quantity_element = names[i+1];
    var quantity = parseInt(quantity_element.charAt(1));

    //adds items in the cart
    var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');

    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}<br><p class="text-danger">Remove</p></span>
        </div>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input center" type="number" value="${quantity}">
        </div>
        <span class="cart-price-1 cart-column-2 text-center">${price}</span>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);

    //update cart total
    updateCartTotal();
    cartRow.getElementsByClassName('text-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', changeQuantity);
  }
}

function purchasedClicked(){ //after purchase is submitted
  var cartItems = document.getElementsByClassName('cart-items')[0];
  while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild); //removes all items from the cart
  }
  updateCartTotal();
  document.getElementsByClassName('cart')[0].style.visibility = 'hidden';
  document.getElementsByClassName('cart-text')[0].style.visibility = 'visible';
  document.getElementsByClassName('cart-text')[0].innerHTML = 'Thank you for ordering with us.<br>You will receive an email from us shortly.<br><br> To place another order, first refresh the page.';
  orderArray = [];
  document.getElementById('order-input').value = '';
  document.getElementById('order-price-input').value = '';

  localStorage.clear(); //clears local storage after order is complete
}

//removes item from the cart
function removeCartItem(event){
  var buttonClicked = event.target;
  var item = buttonClicked.parentElement.parentElement.parentElement;
  var name = item.getElementsByClassName('cart-item-title')[0].innerText.split('\n');
  console.log("name: ", name[0]);

  for (var i = 0; i < orderArray.length; i++){ //finds deleted item in the order array and removes it
    var temp1 = orderArray[0];
    if(orderArray[i].indexOf(name[0]) != -1){
      orderArray[0] = orderArray[i];
      orderArray[i] = temp1;
      orderArray.shift();
    }
  }
  updateItemsList();
  buttonClicked.parentElement.parentElement.parentElement.remove();
  updateCartTotal();

  if(orderArray.length == 0){ //if cart is empty, then it disappears
    document.getElementsByClassName('cart')[0].style.visibility = 'hidden';
    document.getElementsByClassName('cart-text')[0].style.visibility = 'visible';
    document.getElementsByClassName('cart-text')[0].innerHTML = 'Your order will be displayed here when you add items.';
  }
}

//checks if the input for item quantity is valid
function changeQuantity(event){
  var input = event.target;
  if(isNaN(input.value) || input.value <= 0 || input.value >= 5){
    input.value = 1;
  }
  else{ //updates the order array
    var item = input.parentElement.parentElement;
    var name = item.getElementsByClassName('cart-item-title')[0].innerText.split('\n');
    for (var i = 0; i < orderArray.length; i++){ //finds item in the order array and modifies it
      var temp1 = orderArray[0];
      if(orderArray[i].indexOf(name[0]) != -1){
        orderArray[i] = ' ' + name[0] + ' (' + input.value + ')';
      }
    }
    updateItemsList();
  }
  updateCartTotal();
}

//adds item to the cart
function addToCartClicked(event){
  document.getElementsByClassName('cart')[0].style.visibility = 'visible';
  document.getElementsByClassName('cart-text')[0].innerHTML = '';
  document.getElementsByClassName('cart-text')[0].style.visibility = 'hidden';

  var button = event.target;
  var shopItem = button.parentElement;
  var title = shopItem.getElementsByClassName('item-name')[0].innerText;
  var price = shopItem.getElementsByClassName('item-price')[0].innerText;
  var shopItem2 = button.parentElement.parentElement;
  var imageSrc = shopItem2.getElementsByClassName('menu-preview-image')[0].src;
  addItemToCart(title, price, imageSrc, 1);
}

//updates cart total after cart is modified by the three functions above
function updateCartTotal(){
  var cartItemContainer = document.getElementsByClassName('cart-items')[0];
  var cartRows = cartItemContainer.getElementsByClassName('cart-row');
  var totalPrice = 0;
  for(var i = 0; i < cartRows.length; i++){
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName('cart-price-1')[0];
    var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
    var price = parseFloat(priceElement.innerText.replace('$', ''));
    var quantity = quantityElement.value;
    totalPrice += price*quantity;
  }
  totalPrice = Math.round(totalPrice*100)/100;
  var x = '$' + totalPrice;
  document.getElementsByClassName('cart-total-price')[0].innerText = x;
  localStorage.setItem('order-price-input', x);
  document.getElementById('order-price-input').value = localStorage.getItem('order-price-input');
}

function addItemToCart(title, price, imageSrc, quantity){
  var cartRow = document.createElement('div');
  cartRow.classList.add('cart-row');
  var cartItems = document.getElementsByClassName('cart-items')[0];
  var cartItemNames = cartItems.getElementsByClassName('cart-item-title');

  for (var i = 0; i < cartItemNames.length; i++) {
      var x = cartItemNames[i].innerText.split('\n');
      //console.log("llfd", x[0]);
      if (x[0] == title) {
          alert('This item is already added to the cart');
          return; //function ends here, preventing rest of the code from executing
      }
  }
  var cartRowContents = `
    <div class="cart-item cart-column">
        <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
        <span class="cart-item-title">${title}<br><p class="text-danger">Remove</p></span>
    </div>
    <div class="cart-quantity cart-column">
        <input class="cart-quantity-input center" type="number" value="${quantity}">
    </div>
    <span class="cart-price-1 cart-column-2">${price}</span>`;
  cartRow.innerHTML = cartRowContents;
  cartItems.append(cartRow);
  updateCartTotal();
  cartRow.getElementsByClassName('text-danger')[0].addEventListener('click', removeCartItem);
  cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', changeQuantity);

  //adds item to the array
  var orderItem = ' ' + title + ' (1)';
  orderArray.push(orderItem);
  updateItemsList();
}

function updateItemsList(){
  var x = orderArray.toString();
  //alert(orderArray.length);
  console.log(orderArray.length);
  //console.log('x ', x);
  localStorage.setItem('order-input', x);
  console.log(localStorage.getItem('order-input'));

  //document.getElementById('ss').innerText = localStorage.getItem('order-input');

  if(orderArray.length == 0){
    document.getElementById('order-input').value = '';
  }
  else{
    document.getElementById('order-input').value = localStorage.getItem('order-input');
  }
}
