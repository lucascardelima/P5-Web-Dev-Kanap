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

// Cart object. This object will be used to store the products in the cart, get them and also to update the cart.

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
    get: function() {
        let products = localStorage.getItem(CART.KEY);
        CART.contents = JSON.parse(products);
        return CART.contents;
    },
    sync: async function() {
        let productCart = JSON.stringify(CART.contents);
        await localStorage.setItem(CART.KEY, productCart);
    },
    find: function(id, productColor) {
        let matchProduct = CART.contents.find(matchProduct => matchProduct._id == id && matchProduct.color == productColor);
        return matchProduct;
    },
    add: function(id, productColor, qty) {
        if(CART.find(id, productColor)) {
            CART.increase(id, productColor, qty);
        }else {
            let productObject = {'_id' : id, 'quantity' : qty, 'color' : productColor};
            CART.contents.push(productObject);
            CART.sync();
        }
    },
    increase: function(id, productColor, qty) {
        CART.contents = CART.contents.map(product => {
            if(product._id == id && product.color == productColor) {
                product.quantity = Number(product.quantity) + qty;
            }
            return product;
            
        });
        CART.sync();
    },
    change: function(id, color, qty) {
        CART.contents = CART.contents.map(product => {
            if(product._id == id && product.color == color) {
                product.quantity = qty;
            }
            return product;
        });
        CART.sync();
    },
    // Function for the event listener on the delete button. It takes the id and color of the product and
    // filters the cart to remove the product.
    delete: function(id, color) {
        CART.contents = CART.contents.filter(product => {
            return product._id != id || product.color != color;
        });
        CART.sync();
    }

};

// Receive the product object, select the DOM elements and pass the product's information to the DOM.

function createProducts(products, cart) {
    let cartContainer = document.querySelector("#cart__items");
    cartContainer.innerHTML = "";
    for (let i = 0; i < cart.length; i++) {
        const cartProductId = cart[i]._id;
        const cartProductColor = cart[i].color;
        const cartProductQty = cart[i].quantity;
        const productDetails = products.find(product => product._id == cartProductId);

        //Start creating the elements on the DOM.
        
        /////ARTICLE ELEMENT.
        let article = document.createElement("article");
        article.classList.add("cart__item");
        article.setAttribute("data-id", cartProductId);
        article.setAttribute("data-color", cartProductColor);

        ////IMAGE CONTAINER.
        let imgContainer = document.createElement("div");
        imgContainer.classList.add("cart__item__img");

        //Image ELEMENT and ATTRIBUTES.
        let img = document.createElement("img");
        img.setAttribute("src", productDetails.imageUrl);
        img.setAttribute("alt", productDetails.altTxt)

        //Append Image to IMAGE CONTAINER.
        imgContainer.appendChild(img);

        ////DESCRIPTION AND SETTINGS CONTAINER .
        let descriptionAndSettingsContainer = document.createElement("div");
        descriptionAndSettingsContainer.classList.add("cart__item__content");

        ///DESCRIPTION CONTAINER.
        let descriptionContainer = document.createElement("div");
        descriptionContainer.classList.add("cart__item__content__description");

        //Product Name ELEMENT.
        let productName = document.createElement("h2");
        productName.innerHTML = productDetails.name;

        //Produc Color ELEMENT.
        let productColor = document.createElement("p");
        productColor.innerHTML = cartProductColor;

        //Product Price ELEMENT.
        let productPrice = document.createElement("p");
        productPrice.innerHTML = "€" + (productDetails.price * cartProductQty);

        //Append Name, Color and Price to the DESCRIPTION CONTAINER.
        descriptionContainer.append(productName, productColor, productPrice);

        ///SETTINGS CONTAINER.
        let settingsContainer = document.createElement("div");
        settingsContainer.classList.add("cart__item__content__settings");

        //Quantity Container.
        let quantityContainer = document.createElement("div");
        quantityContainer.classList.add("cart__item__content__settings__quantity");

        //Quantity Display ELEMENT.
        let quantityDisplay = document.createElement("p");
        quantityDisplay.innerHTML = "Qté: " + cartProductQty;

        //Quantity Input ELEMENT.
        let quantityInput = document.createElement("input");
        quantityInput.setAttribute("id", "itemQuantity");
        quantityInput.setAttribute("type", "number");
        quantityInput.setAttribute("min", "1");
        quantityInput.setAttribute("max", "99");
        quantityInput.setAttribute("value", cartProductQty);

        //Append Display and Input into Quantity Container.
        quantityContainer.append(quantityDisplay, quantityInput);

        //Delete Button Container.
        let deleteButtonContainer = document.createElement("div");
        deleteButtonContainer.classList.add("cart__item__content__settings__delete");

        //Delete Button ELEMENT.
        let deleteButton = document.createElement("p");
        deleteButton.classList.add("deleteItem");
        deleteButton.innerHTML = "Delete";

        //Append Delete Button into Delete Button Container.
        deleteButtonContainer.appendChild(deleteButton);

        //Append the quantity container and delete button container to the settings container.
        settingsContainer.append(quantityContainer, deleteButtonContainer);

        //Append the description container and settings container to the description and settings container.
        descriptionAndSettingsContainer.append(descriptionContainer, settingsContainer);

        //Append the image container and description and settings container to the article.
        article.append(imgContainer, descriptionAndSettingsContainer);

        //Append the article to the cart container.
        cartContainer.appendChild(article);
    }
};

// Function that receices the products from the backend and the cart from the local storage as arguments, then
// iterates through them calculating the total items in the cart and the total price using the price from the products array
// and the quantity storage in the cart. Finally, it returns the two values;

function calculateTotals(products, cart) {
    let totalItems = 0;
    let totalPrice = 0;
    for (let i = 0; i < cart.length; i++) {
        totalItems += parseInt(cart[i].quantity);
        totalPrice += products.find(product => product._id == cart[i]._id).price * cart[i].quantity;
        
    }
    return [totalItems, totalPrice];
    
}

// Function that receives the total items and total price as arguments,
// then, captures the elements to display the totals and pass into the elements the totals;

function displayTotals(totalItems, totalPrice) {
    let totalItemsElement = document.querySelector("#totalQuantity");
    let totalPriceElement = document.querySelector("#totalPrice");
    totalItemsElement.innerHTML = totalItems;
    totalPriceElement.innerHTML = totalPrice;
}

// Funtion that builds the Cart page received the products from the backend and the cart from the localstorage
// as arguments, then calls the function that creates the products into the DOM. Calls the functions that calculates the totals
// and gets the returned values, then passes into the displaytotals function;

function buildCartPage(products, cart) {
    createProducts(products, cart);
    let [totalItems, totalPrice] = calculateTotals(products, cart);
    displayTotals(totalItems, totalPrice);
};

// Function for the event listener quantity input. It takes the id of the product and the color of the product and
// the quantity of the product and calls the change function passing the id, color and quantity as arguments.

function changeQuantity(event) {
    if (event.target.id == "itemQuantity") {
        let id = event.target.closest("article").getAttribute("data-id");
        let color = event.target.closest("article").getAttribute("data-color");
        let qty = event.target.value;
        CART.change(id, color, qty);

        loadCart();

    }
};

// Function for the event listener on the delete button. It takes the id and color of the product and 
// calls the delete function passing the id and color as arguments. 

function deleteItem(event) {
    if (event.target.classList == "deleteItem") {
        let id = event.target.closest("article").getAttribute("data-id");
        let color = event.target.closest("article").getAttribute("data-color");
        CART.delete(id, color);
        loadCart();
    }
};

//// EVENT LISTENERS ////

// Get the Quantity Changer button and adds an event listener to it.
const changeQuantityInput = document.getElementById("cart__items");
changeQuantityInput.addEventListener("change", changeQuantity);

// Get the Delete Button and adds an event listener to it.
const deleteButton = document.getElementById("cart__items");
deleteButton.addEventListener("click", deleteItem);


// Asyncronous function that make a request for the makeRequest function and awaits for the Promise
// to resolve. Then it passes the JSON response into the const products and calls the buildItems
// function passing products as an argument. 

async function loadCart() {
    const products =  await makeRequest("GET", "http://localhost:3000/api/products");
    const cart = CART.get();
    buildCartPage(products, cart);

};

// Call the function to Load the cart contents into the DOM. 

loadCart();