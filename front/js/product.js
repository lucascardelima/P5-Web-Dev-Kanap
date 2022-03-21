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
    
    for (let i = 0; i < product.colors.length; i++) {
        option = document.createElement("option");
        option.value = product.colors[i];
        option.textContent = product.colors[i];
        dropdown = document.getElementById("colors").appendChild(option);
    }

};

// Asyncronous function that make a request for the makeRequest function and awaits for the Promise
// to resolve. Then it passes the JSON response into the const products and calls the buildItems
// function passing products as an argument. 
// 

async function loadProducts() {
    const requestPromise = makeRequest("GET", "http://localhost:3000/api/products");
    const products = await requestPromise;
    
    const id = getProductId();
    const product = products.find(products => products._id == id);
    
    buildProductPage(product);

};

loadProducts();
