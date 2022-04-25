// Get DOM element

const orderIdDisplay = document.getElementById("orderId");

// Get the current URL, search for the query string and returns the product ID that was passed as one of the parameters.

function getOrderId() {
    const url = window.location.search;
    const urlParams = new URLSearchParams(url);
    return productId = urlParams.get("orderId");
};

let orderId = getOrderId();
orderIdDisplay.textContent = orderId;

