const Application = require("./application");
const Request = require("./Request");
const Response = require("./Response");

const TExpress = () => {
    // const app = Application;

    const app = (req, res, next) => app.handle(req, res, next);
    Object.setPrototypeOf(app, Application);

    app.request = Object.create(Request.prototype, {
        app: {
            configurable: true, // 객체의 프로퍼티를 수정하거나 삭제 가능
            enumerable: true, // 객체 속성 열거 시 노출 여부
            writable: true, // 할당 연산자로 수정 가능 여부
            value: app, // 값
        },
    });

    app.response = Object.create(Response.prototype, {
        app: {
            configurable: true, // 객체의 프로퍼티를 수정하거나 삭제 가능
            enumerable: true, // 객체 속성 열거 시 노출 여부
            writable: true, // 할당 연산자로 수정 가능 여부
            value: app, // 값
        },
    });

    return app;
};

module.exports = TExpress;
