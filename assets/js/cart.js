//checks if the page has loaded
if (document.readyState == 'loading') {
  document.addEventListener('DOMContentLoaded', ready)
} else {
  ready()
}

//if page is loaded, then event listeners are made for the buttons
function ready(){
  document.getElementsByClassName('thank-you-text')[0].innerHTML = 'Your order will be displayed here when you add items.';
  document.getElementsByClassName('cart')[0].style.visibility = 'hidden';

  document.getElementsByClassName('btn-purchase')[0].addEventListener('click', purchasedClicked);

  var removeItemButtons = document.getElementsByClassName('btn-danger');
  //when the "remove" button is clicked, the item is removed from the cart
  for (var i = 0; i < removeItemButtons.length; i++){
    var button = removeItemButtons[i];
    button.addEventListener('click', removeCartItem);
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

function purchasedClicked(){
  var cartItems = document.getElementsByClassName('cart-items')[0];
  while (cartItems.hasChildNodes()) {
      cartItems.removeChild(cartItems.firstChild);
  }
  updateCartTotal();
  document.getElementsByClassName('cart')[0].style.visibility = 'hidden';
  document.getElementsByClassName('thank-you-text')[0].style.visibility = 'visible';
  document.getElementsByClassName('thank-you-text')[0].innerHTML = 'Thank you for your purchase.<br>You will be contacted by Pradeep\'s Cuisine shortly.';
}

//removes item from the cart
function removeCartItem(event){

    console.log('remove button clicked');

    var buttonClicked = event.target;
    buttonClicked.parentElement.parentElement.remove();
    updateCartTotal();
}

//checks if the input for item quantity is valid
function changeQuantity(event){
  var input = event.target;
  if(isNaN(input.value) || input.value <= 0 || input.value >= 5){
    input.value = 1;
  }
  updateCartTotal();
}

//adds item to the cart
function addToCartClicked(event){

  console.log('add-to-cart button clicked');

  document.getElementsByClassName('cart')[0].style.visibility = 'visible';
  document.getElementsByClassName('thank-you-text')[0].innerHTML = '';
  document.getElementsByClassName('thank-you-text')[0].style.visibility = 'hidden';

  var button = event.target;
  var shopItem = button.parentElement;
  var title = shopItem.getElementsByClassName('item-name')[0].innerText;
  var price = shopItem.getElementsByClassName('item-price')[0].innerText;
  var shopItem2 = button.parentElement.parentElement;
  var imageSrc = shopItem2.getElementsByClassName('menu-preview-image')[0].src;

  console.log(title, price, imageSrc);

  addItemToCart(title, price, imageSrc);

}

//updates cart total after cart is modified by the three functions above
function updateCartTotal(){
  var cartItemContainer = document.getElementsByClassName('cart-items')[0];
  var cartRows = cartItemContainer.getElementsByClassName('cart-row');

  var totalPrice = 0;

  for(var i = 0; i < cartRows.length; i++){
    var cartRow = cartRows[i];
    var priceElement = cartRow.getElementsByClassName('cart-price')[0];
    var quantityElement = cartRow.getElementsByClassName('cart-quantity-input')[0];
    var price = parseFloat(priceElement.innerText.replace('$', ''));
    var quantity = quantityElement.value;
    totalPrice += price*quantity;

    console.log(price*quantity);

  }
  totalPrice = Math.round(totalPrice*100)/100;
  document.getElementsByClassName('cart-total-price')[0].innerText = '$' + totalPrice;
}

function addItemToCart(title, price, imageSrc){
  var cartRow = document.createElement('div');
    cartRow.classList.add('cart-row');
    var cartItems = document.getElementsByClassName('cart-items')[0];
    var cartItemNames = cartItems.getElementsByClassName('cart-item-title');
    for (var i = 0; i < cartItemNames.length; i++) {
        if (cartItemNames[i].innerText == title) {
            alert('This item is already added to the cart');
            return;
        }
    }
    var cartRowContents = `
        <div class="cart-item cart-column">
            <img class="cart-item-image" src="${imageSrc}" width="100" height="100">
            <span class="cart-item-title">${title}</span>
        </div>
        <span class="cart-price cart-column">${price}</span>
        <div class="cart-quantity cart-column">
            <input class="cart-quantity-input" type="number" value="1">
            <button class="btn btn-danger" type="button">REMOVE</button>
        </div>`;
    cartRow.innerHTML = cartRowContents;
    cartItems.append(cartRow);
    updateCartTotal();
    cartRow.getElementsByClassName('btn-danger')[0].addEventListener('click', removeCartItem);
    cartRow.getElementsByClassName('cart-quantity-input')[0].addEventListener('change', changeQuantity);
}
