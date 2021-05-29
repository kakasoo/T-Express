const http = require("http");

class Request extends http.IncomingMessage {
    constructor() {
        super();
    }
}

module.exports = Request;
