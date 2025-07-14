// getting data that we need from HTML

// create a async function for Load Data from API

const CategoryMain = document.querySelectorAll(".Category-name");
const ProductsSection = document.querySelector(".Products");
const conditonText = document.querySelector(".Conditon-text");
const goToShop = document.querySelector("#goToShop");
const Home = document.querySelector(".Home");
const Store = document.querySelector(".Store");
const shoppingCart = document.querySelector(".shopping-cart");
const shoppingCartItems = document.querySelector(".shopping-cart-items");
const loader = document.querySelector(".loader");
const productsCounter = document.querySelector(".products-counter");
const productsPrice = document.querySelector(".products-price");
const productsTotalPrice = document.querySelector(".products-Total-price");
const minRange = document.querySelector('#minRange');
const maxRange = document.querySelector('#maxRange');
const minValue = document.querySelector('#minValue');
const maxValue = document.querySelector('#maxValue');
const track = document.querySelector('#track');
const gap = 100;
let globalProducts = [];
let number = 0 ;
let cartData = null;
if(localStorage.getItem("cart")){
  cartData = JSON.parse(localStorage.getItem("cart"));
}else{
  cartData = []
}

const getProducs = async () => {
try{
  let response = await fetch("https://fakestoreapi.com/products");
  let data = await response.json();
  loader.style.display = 'none'
  renderProducts(data);
  globalProducts = data;
  setPriceSliderRange(data);
} catch (error) {
conditonText.textContent = error.message;
console.log(error);
}
}
goToShop.addEventListener("click" , e => shoppingCart.classList.add("show"));
Home.addEventListener("click" , e => shoppingCart.classList.remove("show"));
Store.addEventListener("click" , e => shoppingCart.classList.remove("show"));
const ConvertText = (text) => {
  let splittedtext = text.split(' ');
  let newTitle = splittedtext[0] + splittedtext[1];
  if(splittedtext[1] == '-' || splittedtext[1] == 'and'){
    newTitle =  splittedtext[0] + splittedtext[1] + splittedtext[2];
  }
  return newTitle
}

// set min and miax Price from data to  SliderRange
const setPriceSliderRange = (products) => {
  const prices = products.map(({ price }) => price);
  const [minPrice, maxPrice] = [Math.floor(Math.min(...prices)),Math.ceil( Math.max(...prices) ) ];

  const applyRange = (input, min, max, value) => {
    input.min = min;
    input.max = max;
    input.value = value;
  };

  applyRange(minRange, minPrice, maxPrice, minPrice);
  applyRange(maxRange, minPrice, maxPrice, maxPrice);

  minValue.textContent = `$${minPrice}`;
  maxValue.textContent = `$${maxPrice}`;

  updateSlider();
};


// create a function to render products

const renderProducts = (products) => {
  
// getting items from api with map

  products.map((item) => {

// destructuring object
const {id , image , title , price , category } = item ;



const productElement = document.createElement("div")
productElement.classList.add("Product-box")
productElement.innerHTML = `
    <div class="event-options">
      <i class="fa-solid fa-heart"></i>
    </div>
    <div class="image-container">
      <img src="${image}" alt="${title}">
    </div>
    <div class="product-information">
      <p class="product-name">${ConvertText(title)}</p>
      <p class="product-category">${category}</p>
      <div class="products-buttons">
        <i class="fa-solid fa-shop Shop"></i>
        <button data-id = ${id} class="Buy">Buy <span class="product-price">${price}$</span></button>
      </div>
    </div>`;

ProductsSection.appendChild(productElement);

// active like button on rightCorner of box

 let LikeButton = productElement.querySelector(".fa-heart")
 LikeButton.addEventListener("click" , event => event.target.classList.toggle("Heartactive"))
let addToCartButton = productElement.querySelector(".Buy");

addToCartButton.addEventListener("click" , (e) => {
  
  // when I Click to (Buy) Button , active toastMessage
  
  const toastMessage = document.querySelector(".toast-message");
  const productId = parseInt( e.currentTarget.getAttribute("data-id"));
  const toastContent = e.currentTarget.parentElement.previousElementSibling.previousElementSibling.textContent;
  toastMessage.textContent = `${toastContent} Sucssesfuly Added in Basket`
  toastMessage.classList.add("show");
  setTimeout(() => toastMessage.classList.remove("show") , 1000);


  const selectedProduct = products.find((item) =>  item.id === productId )
addToCart(selectedProduct);

})



})

}

CategoryMain.forEach((item) => {
  item.addEventListener("click" , (() => {
    // activing each icon in buttons (applying active effect)
    
    let itemIcon = item.children[1];
    let itemChilds = item.nextElementSibling.children;
    let childsArray = [...itemChilds]
    itemIcon.classList.toggle("active");

if(itemIcon.classList.contains('active')){

  childsArray.forEach((childItem , i) => {
    // getting height of each Child element and Add it to Number

    

let itemPriceHeight = childItem.getBoundingClientRect().height;
number += itemPriceHeight;
if(childsArray.length > 1 ){
childItem.classList.remove("border")
  childItem.addEventListener("click" , () => filterCategory(childItem , globalProducts , childsArray))
}

})
  // and at final getting and adding CSS style to Childs Container
item.nextElementSibling.style.height  = `${number}px`;
number = 0 ;
}
else{
item.nextElementSibling.style.height  = `0px`;
}
  }))

})



const filterCategory = (item , products , childsArray) => {
  childsArray.forEach((innerItem) => {
innerItem.classList.remove("border")
  })
  item.classList.add("border");
  const itemCategory =  item.children[0].innerHTML;
const machedItmes = products.filter((clickedItem) => {
  return itemCategory === clickedItem.category
})
if(itemCategory === "all"){
  getProducs()
}

ProductsSection.textContent = ``
renderProducts(machedItmes)

}
const addToCart = (product) => {
  const carItem = cartData.find((item)=> {
  return item.id === product.id;
  })
if(!carItem){ cartData.push({...product , quantity : 1 });}
else{carItem.quantity++}


  renderCart()
  saveToLocaleStorage()

}
const saveToLocaleStorage = () => {
  localStorage.setItem("cart" , JSON.stringify(cartData))
}
const renderCart = () => {

shoppingCartItems.innerHTML = '';
if(cartData.length !== 0 ){

  
  cartData.map((item) => {
    const { image , title , price , category , quantity } = item ;
  const cartElement = document.createElement("div");
  cartElement.classList.add("shopping-cart-item")
  
   cartElement.innerHTML =  `
     <div class="image-conatiner-parent">
      <div class="item-image-container">
        <img width="50px" src="${image}" alt="${title}">
      </div>
     </div>
     <div class="info-of-item">
      <p class="name-of-item">${ConvertText(title)}</p>
  <div class="more-info">
    <p class="category-of-item"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18">
      <path d="M19 4L5 4C5 5.699219 3.699219 7 2 7L2 17C3.699219 17 5 18.300781 5 20L19 20C19 18.300781 20.300781 17 22 17L22 7C20.300781 7 19 5.699219 19 4 Z M 17 11L7 11L7 9L17 9 Z M 17 15L7 15L7 13L17 13Z" fill="#1462e8"/>
    </svg>${category}</p>
    <p class="developer-item">Yasin Shaterpour</p>
  </div>
  
  <div class="quantity-and-price">
    <div class="quantity">
      <svg class="itemRemover" xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 64 64">
        <path d="M28 3C25.791 3 24 4.791 24 7L24 9L23.599609 9L7 11L7 14L57 14L57 11L40.400391 9L40 9L40 7C40 4.791 38.209 3 36 3L28 3 z M 28 7L36 7L36 9L28 9L28 7 z M 10 16L14 58L50 58L53.923828 17L10 16 z M 32 23C33.333 23 34 24 34 24L34 53L30 53L30 24C30 24 30.667 23 32 23 z M 18.976562 23.070312C20.306563 22.977313 21.042969 23.929688 21.042969 23.929688L23.007812 53L18.996094 53L17.052734 24.207031C17.052734 24.207031 17.646563 23.163313 18.976562 23.070312 z M 44.978516 23.070312C46.308516 23.163312 46.904297 24.207031 46.904297 24.207031L44.960938 53L40.949219 53L42.914062 23.929688C42.914062 23.929688 43.648516 22.977312 44.978516 23.070312 z" fill="#e72121"/>
      </svg>
      <span class="minus">-</span>
      <input value="${quantity}" disabled type="text">
    <span class="plus">+</span>
    </div>
    <div class="price"><p>${price.toFixed(2)}$</p></div>
  </div>
  
     </div>
  
     `
     const increaseButton = cartElement.querySelector(".plus")
     const decreaseButton = cartElement.querySelector(".minus")
     const itemRemover = cartElement.querySelector(".itemRemover")
  increaseButton.addEventListener("click" , e => IncreaseQunatity(item))
  decreaseButton.addEventListener("click" , e => decreaseQunatity(item))
  itemRemover.addEventListener("click" , e => itemRemoverFunc(item))
     shoppingCartItems.appendChild(cartElement);


  

})
}else{shoppingCartItems.innerHTML = ` 
  <p style="
  text-align: center;
   margin-top : 2rem;
   font-weight : 500 ;
   font-size : 20px ;">ShoppingCart Is Empty</p>`


}

// increase value when we click it

const IncreaseQunatity = (item) => {
  const cartItem = cartData.find((product) =>  item.id === product.id)

  if(cartItem){
    cartItem.quantity++;
    renderCart();
  }
}
// decrease value when we click it

const decreaseQunatity = (item) => {
  const cartItem = cartData.find((product) =>  item.id === product.id)

  if(cartItem && cartItem.quantity > 1 ){
    cartItem.quantity--;
    renderCart();
  }
}

// remove item from cart when we click it

const itemRemoverFunc = (item) => {
  const cartItem = cartData.findIndex((product) =>  item.id === product.id)
cartData.splice(cartItem , 1);
renderCart()
saveToLocaleStorage()
}

const totalPrice = cartData.reduce((total , item) => {
 return  total + item.quantity * item.price
    } , 0)
    productsTotalPrice.textContent = `${totalPrice.toLocaleString()}$`;
    productsPrice.innerHTML = `${totalPrice.toLocaleString()}$ (<span class="products-counter">1</span>)`;
    const Counter =     productsPrice.querySelector(".products-counter");
  Counter.textContent = cartData.length;

  
}



getProducs();
renderCart();





// handeling of price range category , first we intialze it and then filter it With globalProducts (Line 23)

const updateSlider = () =>  {
 
  let min = parseInt(minRange.value);
  let max = parseInt(maxRange.value);

  if (max - min < gap) {
    if (event.target.id === 'minRange') {
      minRange.value = max - gap;
      min = max - gap;
    } else {
      maxRange.value = min + gap;
      max = min + gap;
    }
  }
  minValue.textContent = `$${min}`;
  maxValue.textContent = `$${max}`;
  
  const percent1 = (min / minRange.max) * 100;
  const percent2 = (max / maxRange.max) * 100;
  

  track.style.left = percent1 + '%';
  track.style.width = (percent2 - percent1) + '%';
}

minRange.addEventListener('input', updateSlider);
maxRange.addEventListener('input', updateSlider);
updateSlider();

const PriceRange = (products) => {

  let min = parseInt(minRange.value);
  let max = parseInt(maxRange.value);

  const filteredProducts = products.filter((item) => {
    return item.price >= min && item.price <= max;
  });

  ProductsSection.innerHTML = "";
  renderProducts(filteredProducts);
};
minRange.addEventListener("change", () => PriceRange(globalProducts));
maxRange.addEventListener("change", () => PriceRange(globalProducts));