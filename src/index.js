import req from "./request";
import res from "./response";
import application from "./application";

const createApplication = () => {
    const app = { ...application };

    app.request = Object.create(req, {
        app: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: app,
        },
    });

    app.response = Object.create(res, {
        app: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: app,
        },
    });

    return app;
};

export default createApplication;
