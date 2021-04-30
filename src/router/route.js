class Route {
    constructor(path) {
        this.path = path;
        this.stack = [];
        this.methods = {};
    }

    /**
     *
     * @param {string} method
     * @returns
     */
    handle(method) {
        if (this.methods.all) {
            return true;
        }

        let methodName = method.toLowerCase();

        if (methodName === "head" && !this.methods) {
            methodName = "get";
        }
        return Boolean(this.methods[methodName]);
    }
}
