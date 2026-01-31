const BASE_URL = import.meta.env.VITE_API_BASE;

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
