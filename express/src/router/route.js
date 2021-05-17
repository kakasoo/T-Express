// import { METHODS } from "http";
const METHODS = ["get"];
import Layer from "./layer";

class Route {
    constructor(path) {
        this.path = path;
        this.stack = []; // path 단위로 route 된 이후의 stack이므로 메서드 분기를 의미
        this.methods = {};

        METHODS.forEach((METHOD) => {
            const method = METHOD.toLowerCase();

            // route에서 메서드 단위로 함수를 등록하는 일
            this[method] = (...fn) => {
                const handles = fn;

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
            const layer = this.stack[index++];
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

    handle(method) {
        let name = method.toLowerCase();
        if (name === "head" && !this.method["head"]) {
            name = "get";
        }

        return Boolean(this.methods[name]);
    }
}

export default Route;
