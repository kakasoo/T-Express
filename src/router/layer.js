import { pathToRegexp } from "path-to-regexp";

class Layer {
    constructor(path, fn, options) {
        this.path = path;
        this.methods = {};
        this.handle = fn;

        this.regexp = pathToRegexp(path, (this.keys = []), options);
        this.regexp.fast_star = path === "*";
        this.regexp.fast_slash = path === "/" && options.end === false;
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

    match(path) {
        let match;
        if (!path) {
            // 슬래시 1개만 존재하는 경우, route와 정확히 일치하는 경우
            // if (this.regexp.fast_slash) {
            //     this.params = {};
            //     this.path = "";
            //     return true;
            // }
            // if (this.regexp.fast_star) {
            // }

            match = this.regexp.exec(path);
        }

        if (!match) {
            this.params = undefined;
            this.path = undefined;
            return false;
        }

        this.params = {};
        this.path = match[0];

        return true;
    }
}

export default Layer;
