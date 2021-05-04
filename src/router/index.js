import parseUrl from "parseurl";

import Route from "./route";
import Layer from "./layer";

class Router {
    constructor() {
        this.stack = [];

        this.slashAdded = false;
        this.searchIndex;
        this.removed = "";
        this.pathLength;
        this.fqdnIndex;
    }

    route(path) {
        const route = new Route(path);
        const layer = new Layer(path, route.dispatch.bind(route), {});
        layer.route = route;
        this.stack.push(layer);
        return route;
    }

    handle(req, res, out) {
        const protohost = this.getProtohost(req.url) || "";
        const options = [];
        const parentParams = req.params;
        const parentUrl = req.baseUrl || "";
        const done = this.restore(out, req, "baseUrl", "next", "params");

        req.next = this.next;

        // if(req.method === 'OPTIONS') {
        //     done = wrap
        // }

        req.baseUrl = parentUrl;
        req.originalUrl = req.originalUrl || req.url;

        const next = (err) => {
            let index = 0;
            let layerError = err === "route" ? null : err;

            if (this.slashAdded) {
                req.url = req.url.substr(1);
                this.slashAdded = false;
            }

            if (this.removed.length !== 0) {
                req.baseUrl = parentUrl;
                req.url =
                    protohost + this.removed + req.url.substr(protohost.length);
                this.removed = "";
            }

            if (layerError === "route") {
                setImmediate(done, layerError);
                return;
            }

            if (index >= this.stack.length) {
                setImmediate(done, layerError);
                return;
            }

            const path = parseUrl(req).pathname;

            let layer;
            let match;
            let route;

            while (match !== true && index < this.stack.length) {
                layer = this.stack[index++];
                match = layer.match(path);
                route = layer.route;

                if (typeof match !== "boolean") {
                    layerError = layerError || match;
                }

                if (match !== true) {
                    continue;
                }

                if (!route) {
                    continue;
                }

                if (layerError) {
                    match = false;
                    continue;
                }

                const method = req.method;
                const has_method = route.handle(method);
            }

            if (match !== true) {
                return done(layerError);
            }

            if (route) {
                req.route = route;
            }
            layer.handleRequest(req, res, next);
        };
        next();
    }

    restore(fn, obj) {
        const props = new Array(arguments.length - 2);
        const vals = new Array(arguments.length - 2);

        for (let i = 0; i < props.length; i++) {
            props[i] = arguments[i + 2];
            vals[i] = obj[props[i]];
        }

        return function () {
            for (let i = 0; i < props.length; i++) {
                obj[props[i]] = vals[i];
            }

            return fn.apply(this, arguments);
        };
    }

    getProtohost(url) {
        if (typeof url !== "string" || url.length === 0 || url[0] === "/") {
            return undefined;
        }

        this.searchIndex = url.indexOf("?");
        this.pathLength = searchIndex !== -1 ? searchIndex : url.length;
        this.fqdnIndex = url.substr(0, pathLength).indexOf("://");

        return this.fqdnIndex !== -1
            ? url.substr(0, url.indexOf("/", 3 + fqdnIndex))
            : undefined;
    }
}

export default Router;
