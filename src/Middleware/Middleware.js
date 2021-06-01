const Middleware = {
    init: (app) => (req, res, next) => {
        req.res = res;
        res.req = req;
        req.next = next;

        Object.setPrototypeOf(req, app.request);
        Object.setPrototypeOf(res, app.response);

        next();
    },
};

module.exports = Middleware;
