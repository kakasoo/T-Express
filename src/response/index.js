import http from "http";

class Response extends http.ServerResponse {
    send(body) {
        console.log("body : ", body);
    }
}

export default Response;
