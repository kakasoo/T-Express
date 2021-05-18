const http = require("http");
const PORT = 3000;

const { METHODS } = require("http");

const TExpress = () => {
    const app = (req, res) => {
        const url = req.url;
        const method = req.method.toLowerCase();
        app[url][method](req, res);
    };

    METHODS.forEach((METHOD) => {
        const method = METHOD.toLowerCase();
        app[method] = (path, callback) => {
            if (!app[path]) {
                app[path] = {};
            }

            app[path][method] = callback;
        };
    });
    return app;
};

const app = TExpress();
app.get("/", (req, res, next) => res.end("root."));

const server = http.createServer(app);

server.listen(PORT, () => console.log("Server is opened."));
