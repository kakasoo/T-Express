const http = require("http");
const PORT = 3000;

const { METHODS } = require("http");
const Router = require("./router.js");

const TExpress = () => {
    const app = (req, res) => {
        if (!this.router) {
            throw new Error("No router defined on this app.");
        }
        this.router.handle(req, res);
    };

    METHODS.forEach((METHOD) => {
        const method = METHOD.toLowerCase();
        app[method] = (path, ...callback) => {
            if (!this.router) {
                this.router = new Router();
            }

            const route = this.router.route(path);
            // route[method] = callback;
            route[method].apply(route, callback);
        };
    });
    return app;
};

const app = TExpress(); // TExpress를 만드는 구간

app.get("/", (req, res, next) => res.end("root.")); // TExpress의 메서드 별 함수를 등록하는 구간

const server = http.createServer(app); // 사용자가 들어오는 구간
server.listen(PORT, () => console.log("Server is opened."));
