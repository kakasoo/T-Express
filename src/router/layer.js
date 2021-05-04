import { pathToRegexp } from "path-to-regexp";

class Layer {
    constructor(path, fn, options) {
        this.path;
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

    handleError(err, req, res, next) {
        const fn = this.handle;

        // function's length is parameter number;
        if (fn.length !== 4) {
            // not a standard request handler
            return next(err);
        }

        try {
            fn(req, res, next);
        } catch (err) {
            next(err);
        }
    }

    handleRequest(req, res, next) {
        const fn = this.handle;
        // (fn.length);

        if (fn.length > 3) {
            return next();
        }

        try {
            fn(req, res, next);
        } catch (err) {
            next(err);
        }
    }

    decode_params(value) {
        if (typeof value !== "string" || value.length === 0) {
            return value;
        }

        try {
            return decodeURIComponent(value);
        } catch (err) {
            if (err instanceof URIError) {
                err.message = `Failed to decode param '${value}'`;
                err.status = err.statusCode = 400;
            }
            throw err;
        }
    }

    match(path) {
        let match;
        if (!path) {
            // 슬래시 1개만 존재하는 경우, route와 정확히 일치하는 경우
            if (this.regexp.fast_slash) {
                this.params = {};
                this.path = "";
                return true;
            }
            if (this.regexp.fast_star) {
                this.params = { 0: this.docode_param(path) };
            }
        }
        match = this.regexp.exec(path);

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
