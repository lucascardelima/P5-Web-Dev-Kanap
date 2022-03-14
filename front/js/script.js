// Get acess to the DOM Elements from the index page

// Make a GET request

function makeRequest(verb, url) {
    return new Promisse ((resolve, reject) => {
        let request = new XMLHttpRequest();
        request.open(verb, url);
        
        request.onsteadystatechange = () => {
            if (request.readyState === 4) {
                if (request.status === 200) {
                    resolve(JSON.parse(request.response));
                } else {
                    reject(JSON.parse(request.response));
                }
            }
        }
    });
};

