class Layer {
    constructor(path, option, handler) {
        this.path = path;
        this.option = option;
        this.handler = handler;
    }

    handleRequest(req, res, next) {
        this.handler(req, res, next);
    }
}

module.exports = Layer;
