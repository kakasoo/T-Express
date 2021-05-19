const { METHODS } = require("http");

class Layer {
    constructor(path, option, handler) {
        this.path = path;
        this.option = option;
        this.handler = handler;
    }

    handleRequest(req, res) {
        this.handler(req, res);
    }
}

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
            curLayer.handleRequest(req, res);
        }

        throw new Error("No Layer on this route.");
    }
}

class Router {
    constructor() {
        this.stack = [];
    }

    route(path) {
        const route = new Route(path);
        const layer = new Layer(path, {}, route.dispatch.bind(route));
        layer.route = route; // 자신이 속해있는 route가 무엇인지 등록해둡니다.
        this.stack.push(layer);

        return route;
    }

    handle(req, res) {
        const url = req.url; // 1) url을 알아낸 다음에,
        const method = req.method.toLowerCase();

        for (let i = 0; i < this.stack.length; i++) {
            const curLayer = this.stack[i];

            if (curLayer.path !== url) {
                // 2) 각각의 Layer에서 path가 일치하는 걸 찾습니다.
                continue;
            }

            if (!curLayer.route.hasMethod(method)) {
                // 3) 일치한다면 method에 해당하는 함수가 있는지 체크합니다.
                continue;
            }

            curLayer.handleRequest(req, res); // 3) 일치하는 Layer에게 요청된 method를 실행합니다.
        }
    }
}

module.exports = Router;
