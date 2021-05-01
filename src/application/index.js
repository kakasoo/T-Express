import { METHODS } from "http";
import { flat, slice } from "../util";

class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];

        METHODS.forEach((METHOD) => {
            const method = METHOD.toLowerCase();
            this[method] = (...params) => {
                console.log("params : ", params);
            };
        });
    }
}

class Layer {
    constructor(path, route, option) {
        this.path = path;
        this.methods = [];
        this.route = route;
    }

    handleMethod(methodName) {
        if (this.methods.includes("all")) {
            return true;
        }

        if (methodName === "head" && !this.methods["head"]) {
            methodName = "get";
        }
        return Boolean(this.methods[methodName]);
    }
}

class Router {
    constructor() {
        this.stack = [];
    }

    route(path) {
        const route = new Route(path);
        const layer = new Layer(path, route, {});
        this.stack.push(layer);
        return route;
    }
}

class Application {
    constructor() {
        METHODS.forEach((METHOD) => {
            const method = METHOD.toLowerCase();
            this[method] = (path, fn) => {
                fn(this.request, this.response);

                this.router = new Router();
                const route = this.router.route(path);
                console.log("route : ", route);
                route[method].apply(route, slice.call(arguments, 1));
                return this;
            };
        });
    }

    init() {}
}

export default Application;
