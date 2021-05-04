import { METHODS } from "http";
import http from "http";
import finalhandler from "finalhandler";

import Router from "../router";
import { slice, logerror } from "../util";

class Application {
    init() {
        this.setting = {};
        this.set("env", process.env.NODE_ENV || "development");

        // TODO : 이 콜백함수를 별도로 저장하여, HTTP 메서드 확장이 가능하도록 한다.
        METHODS.forEach((METHOD) => {
            const method = METHOD.toLowerCase();
            // 각 메서드 별로 함수를 등록하는 구간
            this[method] = (path, ...fn) => {
                if (method === "get" && arguments.length === 1) {
                    return this.set(path);
                }

                // 아래는 등록되어 있는 함수
                // ex) app.get(path, fn)이 실제로 아래처럼 실행되게 되어 있는 셈이다.
                if (!this.router) {
                    this.router = new Router();
                }

                // 해당 path를 지닌 Route와 Layer로 새 route를 분기시켜 등록하는 것.
                const route = this.router.route(path);
                // app.get('/', () => {}); 에서 첫 매개변수인 path를 제거한 것.
                route[method].apply(route, fn);
                return this;
            };
        });

        this.defaultConfiguration();
        return true;
    }

    defaultConfiguration() {
        // this.on("mount", (parent) => {
        //     Object.assign(this.response, parent.response);
        // });
    }

    get(key) {
        return this.set[key];
    }

    set(key, value) {
        this.setting[key] = value;
    }

    handle(req, res, callback) {
        const router = this.router;
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

    defaultConfiguration: {
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
