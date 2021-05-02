// import { METHODS } from "http";
import http from "http";
const METHODS = ["GET"];
import finalhandler from "finalhandler";
import { EventEmitter } from "events";
import { flat, slice } from "../util";

class Route {
    constructor(path) {
        this.path = path;
        this.stack = []; // path 단위로 route 된 이후의 stack이므로 메서드 분기를 의미
        this.methods = {};
        METHODS.forEach((METHOD) => {
            const method = METHOD.toLowerCase();
            this[method] = (...handles) => {
                for (let i = 0; i < handles.length; i++) {
                    const handle = handles[i];

                    if (typeof handle !== "function") {
                        throw new Error("Route's handle error!");
                    }

                    // 진입한 이후이므로 path는 '/'가 되야 마땅하다.
                    const layer = new Layer("/", handle, {});
                    layer.method = method;
                    this.methods[method] = true;
                    this.stack.push(layer);
                }
                return this;
            };
        });
    }

    // 실질적으로 request와 response 사이의 처리를 담당한다.
    dispatch(req, res, done) {
        let index = 0;
        // 어떠한 메서드도 아직 생성되지 않은 경우
        if (this.stack.length === 0) {
            return done();
        }

        const method = req.method.toLowerCase();
        if (method === "head" && !this.method["head"]) {
            method = "get";
        }

        req.route = this;

        const next = (err) => {
            if (err && err === "route") {
                return done(err);
            }

            if (err && err === "router") {
                return done(err);
            }

            // 더 이상 진입할 layer가 없는 경우 ( method가 없는 경우 )
            const layer = stack[index++];
            if (!layer) {
                return done(err);
            }

            // 필요로 하는 메서드와 현재 layer의 메서드가 다른 경우
            if (layer.method && layer.method !== method) {
                return next(err);
            }

            if (err) {
                layer.handleError(err, req, res, next);
            } else {
                layer.handleRequest(req, res, next);
            }
        };
        next();
    }
}

class Layer {
    constructor(path, fn, options) {
        this.path = path;
        this.methods = {};
        this.handle = fn;
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

    handleError(error, req, res, next) {
        const fn = this.handle;

        // function's length is parameter number;
        if (fn.length !== 4) {
            // not a standard request handler
            return next(error);
        }

        try {
            fn(req, res, next);
        } catch (err) {
            next(err);
        }
    }

    handleRequest() {
        const fn = this.handle;

        if (fn.length > 3) {
            return next();
        }

        try {
            fn(req, res, next);
        } catch (err) {
            next(err);
        }
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
        Object.assign(this, EventEmitter.prototype); // HTTP event를 감지하기 위함.

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
        this.init();
    }

    init() {
        this.set("env", process.env.NODE_ENV || "development");
    }

    set(key, value) {
        this[key] = value;
    }

    handle(req, res, callback) {
        const router = this.router;
        const done =
            callback ||
            finalhandler(req, res, {
                env: this.get("env"),
                onerror: logerror.bind(this),
            });

        if (!router) {
            done();
            return;
        }

        router.handle(req, res, done);
    }

    listen(...argv) {
        const server = http.createServer(this);
        return server.listen.apply(server, argv);
    }
}

export default Application;
