const http = require("http");

class Response extends http.ServerResponse {
    constructor() {
        super();
    }

    send(message) {
        this.end("send Func : " + message);
    }
}

module.exports = Response;
