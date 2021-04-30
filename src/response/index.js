import http from "http";

class Response extends http.ServerResponse {
    constructor() {
        super();
    }

    send(body) {}
}

export default Response;
