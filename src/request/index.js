import http from "http";

class Request extends http.IncomingMessage {
    constructor() {
        super();
    }
}

export default Request;
