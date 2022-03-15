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


// Asyncronous function that make a request for the makeRequest function and awaits for the Promise
// to resolve. Then it passes the JSON response into the const products and calls the buildItems
// function passing products as an argument. 
// 

async function loadProducts() {
    const requestPromise = makeRequest("GET", "http://localhost:3000/api/products");
    const products = await requestPromise;
    
    buildItems(products);

};

// Build an item with it's elements and attributes for each product in the products JSON response. 
// Then appends the items to the section of id="item".

function buildItems(products) {
    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        
        img = document.createElement("img");
        img.src = product.imageUrl;
        img.alt = product.altTxt;

        h3 = document.createElement("h3");
        h3.innerHTML = product.name;

        p = document.createElement("p");
        p.innerHTML = product.description;

        article = document.createElement("article");
        article.append(img, h3, p);

        item = document.createElement("a");
        item.href = "./product.html?id=" + product._id;
        item.appendChild(article);

        document.getElementById("items").appendChild(item);

    }
};


loadProducts();















