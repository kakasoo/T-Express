import http from "http";

class Response extends http.ServerResponse {
    constructor() {
        super();
    }

    send(body) {
        console.log("body : ", body);
    }
}

export default Response;
