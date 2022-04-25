// Get the orderId DOM element

const orderIdDisplay = document.getElementById("orderId");

// Get the current URL, search for the query string and returns the product ID that was passed as one of the parameters.

function getOrderId() {
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    return productId = urlParams.get("orderId");
};

// Calls the getOrderId function and passes the returned value to the orderIdDisplay DOM element.

let orderId = getOrderId();

// Assigns the orderId value to the orderIdDisplay DOM element.

orderIdDisplay.textContent = orderId;

