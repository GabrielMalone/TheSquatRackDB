export default class fetchWrapper{

    constructor(baseUrl){
        this.baseUrl = baseUrl;
    }
    get(endPoint){
        return fetch(this.baseUrl + endPoint).then(res=>res.json());
    }
    put(endPoint, body){
        return this.#send("put", endPoint, body);
    }
    post(endPoint, body){
        return this.#send("post", endPoint, body);
    }
    delete(endPoint, body){
        return this.#send("delete", endPoint, body);
    }
    
    #send(method,endPoint, body){
        return fetch(this.baseUrl + endPoint, {
            method  : method,
            headers : {
                "Content-Type" : "application/json"
            },
            body    : JSON.stringify(body)
        })
        .then(res=>res.json());
    }
}