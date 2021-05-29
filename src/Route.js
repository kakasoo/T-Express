const { METHODS } = require("http");
const Layer = require("./Layer");

class Route {
    constructor(path) {
        this.path = path;
        this.methods = {};
        this.stack = [];

        METHODS.forEach((METHOD) => {
            const method = METHOD.toLowerCase();

            this[method] = (...handlers) => {
                for (const handler of handlers) {
                    const layer = new Layer("/", {}, handler);
                    layer.method = method;

                    this.methods[method] = true;
                    this.stack.push(layer);
                    return this;
                }
            };
        });
    }

    hasMethod(method) {
        if (this.methods.all) {
            return true;
        }

        return Boolean(this.methods[method]);
    }

    dispatch(req, res, done) {
        const method = req.method.toLowerCase();

        req.route = this;

        for (const curLayer of this.stack) {
            if (curLayer.method && curLayer.method !== method) {
                continue;
            }
            curLayer.handleRequest(req, res, done);
        }

        // throw new Error("No Layer on this route.");
    }
}

module.exports = Route;
