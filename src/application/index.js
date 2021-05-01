// import { METHODS } from "http";
const METHODS = ["GET"];
import { flat, slice } from "../util";

class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        this.methods = {};

        METHODS.forEach((METHOD) => {
            const method = METHOD.toLowerCase();
            this[method] = (...handles) => {
                for (let i = 0; i < handles.length; i++) {
                    const handle = handles[i];

                    if (typeof handle !== "function") {
                        throw new Error("Route's handle error!");
                    }

                    const layer = new Layer("/", handle, {});
                    layer.method = method;

                    this.methods[method] = true;
                    this.stack.push(layer);
                }
            };
        });
    }
}

class Layer {
    constructor(path, route, option) {
        this.path = path;
        this.methods = {};
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
                // TODO : Router 당 1개의 path만 저장되는 문제가 발생.
                // this.router = new Router();
                if (!this.router) {
                    this.router = new Router();
                }

                const route = this.router.route(path);

                // app.get('/', () => {}); 에서 첫 매개변수인 path를 제거한 것.
                route[method].apply(route, slice.call(arguments, 1));
                return this;
            };
        });
    }

    init() {}
>>>>>>> e58b173c0e560adb5aed8cfaa0cefd7f34756d4d
}

export default Application;
