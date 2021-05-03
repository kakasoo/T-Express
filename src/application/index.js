import { METHODS } from "http";
import http from "http";
import finalhandler from "finalhandler";

import Router from "../router";
import { slice, logerror } from "../util";

class Application {
    init() {
        this.setting = {};
        this.set("env", process.env.NODE_ENV || "development");

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

    get(key) {
        return this.set[key];
    }

    set(key, value) {
        this.setting[key] = value;
    }

    handle(req, res, callback) {
        const router = this.router;
        console.log("this router : ", router);
        console.log("this router's handle : ", router.handle);
        const done =
            callback ||
            finalhandler(req, res, {
                onerror: logerror.bind(this),
            });

        if (!router) {
            done();
            return;
        }

        router.handle(req, res, done);
    }

    lazyrouter() {
        if (!this.router) {
            this.router = new Router();
        }
    }

    route(path) {
        this.lazyrouter();
        return this.router.route(path);
    }

    listen(...argv) {
        const server = http.createServer(this);
        return server.listen.apply(server, argv);
    }
}

Object.defineProperties(Application.prototype, {
    handle: {
        enumerable: true,
    },

    init: {
        enumerable: true,
    },

    set: {
        enumerable: true,
    },

    listen: {
        enumerable: true,
    },
});

export default Application;
