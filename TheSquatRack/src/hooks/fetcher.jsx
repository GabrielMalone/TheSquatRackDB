const BASE_URL = "http://127.0.0.1:5002/";

export function get(endpoint){
    return fetch(BASE_URL + endpoint)
    .then(r=>r.json());
}

export function post(endpoint, data){
    return fetch(BASE_URL + endpoint, { 
        headers: {
            "Content-Type" : "application/json"
        } ,
        method: "POST",
        body: JSON.stringify(data)
    }).then(response => response.json())
}
