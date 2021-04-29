import http from "http";

class Response extends http.ServerResponse {
    constructor() {
        super();
    }
}

export default new Response();
