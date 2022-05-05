// Call DOM elements

const addToCartBtn = document.getElementById('addToCart');
const itemQuantity = document.getElementById('quantity');
const itemColor = document.getElementById('colors');

// Get the current URL, search for the query string and returns the product ID that was passed as one of the parameters.

function getProductId() {
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    return productId = urlParams.get("productId");
}

// Make a XMLHttp request receiving a VERB and the API URL as an argument and returning a promisse
// Promise object witht the response resolved from the API in JSON format. 

function makeRequest(verb, url) {
    return new Promise((resolve, reject) => {
        let request = new XMLHttpRequest();
        
        request.onreadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject(JSON.parse(request.response));
                }
            }
        }
        
        request.open(verb, url);
        request.send();
    });
};

// Receive the product object, select the DOM elements and pass the product's information to the DOM.

function buildProductPage(product) {
    document.getElementById("price").textContent = product.price;
    document.getElementById("title").textContent = product.name;
    document.getElementById("productImage").src = product.imageUrl;
    document.getElementById("productImage").alt = product.altTxt;
    document.getElementById("description").textContent = product.description;
    document.getElementById("pageTitle").textContent = product.name;
    
    for (let i = 0; i < product.colors.length; i++) {
        option = document.createElement("option");
        option.value = product.colors[i];
        option.textContent = product.colors[i];
        dropdown = document.getElementById("colors").appendChild(option);
    }

};

// Asyncronous function that make a request for the makeRequest function and awaits for the Promise
// to resolve. Then it passes the JSON response into the const products and calls the buildItems
// function passing products as an argument;

async function loadProducts() {
    const id = getProductId();
    const product =  await makeRequest("GET", "http://localhost:3000/api/products/" + id);
    
    buildProductPage(product);
};

// Calls the function

loadProducts();

// CART object that stores the product's information in the local storage;

const CART = {
    KEY: 'cart',
    contents: [],
    init: function() {
        let products = localStorage.getItem(CART.KEY);
        if(products) {
            CART.contents = JSON.parse(products);
        } else{
            CART.contents = [];
            CART.sync();
        }
    },
    // Syncs the cart with the local storage;
    sync: async function() {
        let productCart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, productCart);
    },
    // Loops through the cart contents array looking for the product with macthing id and color and returns the product;
    find: function(id, productColor) {
        let matchProduct = CART.contents.find(matchProduct => matchProduct._id == id && matchProduct.color == productColor);
        return matchProduct;
    },
    // Adds a product to the cart contents array, passing the ID, color and quantity as arguments and syncs it to the local storage;
    add: function(id, productColor, qty) {
        if(productColor && qty) {
            document.getElementById('submitErrorMsg').innerHTML = ''
            if(CART.find(id, productColor)) {
                CART.increase(id, productColor, qty);
            }else {
                let productObject = {'_id' : id, 'quantity' : qty, 'color' : productColor};
                CART.contents.push(productObject);
                CART.sync();
            }
        } else {
            document.getElementById('submitErrorMsg').innerHTML = 'Select at least one color'
        }
    },
};

// Adds a event listener to the window object that listens for the page load event and calls the CART.init method to initialize the cart;

window.addEventListener('load', CART.init());

// Adds a product to the cart contents array, passing the ID, color and quantity as arguments;

function storageProductDetails() {
    const id = getProductId();
    const qty = Number(itemQuantity.value);
    const productColor = itemColor.value;

    CART.add(id, productColor, qty);
};

// Adds a event listener to the addToCart button that listens for the click event and calls the storageProductDetails function;

addToCartBtn.addEventListener("click", storageProductDetails);

