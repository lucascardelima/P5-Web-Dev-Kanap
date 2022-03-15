// Get acess to the DOM Elements from the index page

const items = document.getElementById('items');
const itemPhoto = document.querySelector('img.itemPhoto');
const productName = document.querySelector('h3.productName');
const productDescription = document.querySelector('p.productDescription');


// Make a GET request

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



async function getProducts() {
    const requestPromise = makeRequest("GET", "http://localhost:3000/api/products");
    const products = await requestPromise;

    const primeiro = products[0];
    
    itemPhoto.src = primeiro.imageUrl;
    productName.textContent = primeiro.name;
    productDescription.textContent = primeiro.description;

};

getProducts();















