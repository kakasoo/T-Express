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
        const layer = new Layer(path, route, {});
        this.stack.push(layer);
        return route;
    }

    handle(req, res, out) {
        const protohost = this.getProtohost(req.url) || "";
        console.log("protohost : ", protohost);

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

        this.next(req);
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
            return fn.apply(this.arguments);
        };
    }

    next(req, err) {
        let index = 0;

        const layerError = err === "route" ? null : err;

        // if(slashAdded) {}
        // if(removed.length !== 0) {}
        // if(layerError === 'route') {}
        // if(index >= stack.length) {}

        const path = parseUrl(req).pathname;

        let layer;
        let match;
        let route;

        while (!match && index < this.stack.length) {
            layer = this.stack[index++];
            match = layer.match(path);
            route = layer.route;

            if (typeof match !== "boolean") {
                layerError = layerError || match;
            }

            if (!match) {
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

            // 에러 처리가 필요
        }
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
