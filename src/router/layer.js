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

export default Layer;
