const Layer = require("./Layer");
const Route = require("./Route");

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

    handle(req, res, out) {
        let idx = 0;
        const url = req.url;
        const method = req.method.toLowerCase();

        const next = (err) => {
            if (err) {
                throw new Error(`next(), It may be Router or Layer Error.`);
            }

            while (idx < this.stack.length) {
                const curLayer = this.stack[idx++];

                // 여기도 나중엔 별도의 함수로 대체해줍시다.
                if (curLayer.path !== url) {
                    continue;
                }

                // 미들웨어의 경우 route가 없을 것이기 때문에 건너 뜁니다.
                if (!curLayer.route) {
                    curLayer.handleRequest(req, res, next);
                    continue;
                }

                if (!curLayer.route.hasMethod(method)) {
                    continue;
                }

                curLayer.handleRequest(req, res, next); // 추가로 next도 이제 넣어주었습니다.
            }
        };
        next();
    }

    use(...fn) {
        let path = "/";
        if (fn.length !== 1 && typeof fn[0] !== "function") {
            path = fn.unshift();
        }

        for (const middleware of fn) {
            if (typeof middleware !== "function") {
                throw new TypeError(
                    `Router.use() requires a middleware function but got a ${typeof middleware}`
                );
            }

            const middlewareLayer = new Layer(path, {}, middleware);
            middlewareLayer.route = undefined; // 미들웨어기 때문에 분기처리하지 않는다. 다음으로 이동하게 한다.

            this.stack.push(middlewareLayer);
        }
        return this;
    }
}

module.exports = Router;
