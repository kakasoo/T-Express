class Route {
    constructor(path) {
        this.path = path;
        // this.stack = [];
        this.methods = {};
    }

    /**
     *
     * @param {string} method
     */
    handle(method) {
        if (this.methods.all) {
            return true;
        }

        let methodName = method.toLowerCase();

        if (methodName === "head" && !this.methods["head"]) {
            methodName = "get";
        }
        return Boolean(this.methods[methodName]);
    }

    options() {
        const methods = Object.keys(this.methods);

        if (this.methods.get && !this.methods.head) {
            methods.push("head");
        }

        for (let i = 0; i < methods.length; i++) {
            methods[i] = methods[i].toUpperCase();
        }
        return methods;
    }

    dispatch(req, res, done) {
        // let index = 0;
        // const stack = this.stack;
        // if (stack.length === 0) {
        //     return done();
        // }

        const method = req.method.toLowerCase();
        if (method === "head" && !this.methods["head"]) {
            method = "get";
        }

        req.route = this;

        this.next();
    }

    next(err) {
        if (err && err === "route") {
            return done(err);
        }
    }
}

export default Route;
