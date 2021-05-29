const { METHODS } = require("http");
const Middleware = require("./Middleware");
const Router = require("./Router");

class Application {
    constructor() {
        METHODS.forEach((METHOD) => {
            const method = METHOD.toLowerCase();
            this[method] = function (path, ...callback) {
                this.lazyRouter();

                const route = this.router.route(path);
                route[method].apply(route, callback);
            };
        });
    }

    lazyRouter() {
        if (!this.router) {
            this.router = new Router();
        }

        this.router.use(Middleware.init(this));
    }

    handle(req, res, next) {
        if (!this.router) {
            throw new Error("No router defined on this app.");
        }

        this.router.handle(req, res, next);
    }

    use(...fn) {
        this.lazyRouter();

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

            this.router.use(middleware);
        }
        return this;
    }
}

module.exports = new Application();
