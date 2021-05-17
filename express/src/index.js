import Req from "./request";
import Res from "./response";
import Application from "./application";
import { EventEmitter } from "events";

const createApplication = () => {
    // TODO : 이벤트 발생 시 app 함수를 실행시키는 효과 (아마도 app.listen에 비밀이 있다.)
    const app = function (req, res, next) {
        console.log("app.response.send : ", app.response.send);
        // Object.assign(req, app.request);
        // Object.assign(res, app.response);
        res.send = app.response.send;
        console.log("@@@@@@@@@@@@@@@@@@@");
        console.log("createApplication res.send : ", res.send);
        console.log("@@@@@@@@@@@@@@@@@@@");
        app.handle(req, res, next);
    };

    Object.assign(app, Application.prototype);
    Object.assign(app, EventEmitter.prototype);

    // req는 감쳐진 속성으로 존재하는 아래 app 객체를 생성한다.
    app.request = Object.create(Req.prototype, {
        app: {
            configurable: true, // 객체의 프로퍼티를 수정하거나 삭제 가능
            enumerable: true, // 객체 속성 열거 시 노출 여부
            writable: true, // 할당 연산자로 수정 가능 여부
            value: app, // 값
        },
    });

    app.response = Object.create(Res.prototype, {
        app: {
            configurable: true,
            enumerable: true,
            writable: true,
            value: app,
        },
    });

    // Object.assign 등으로 prototype 간의 합성을 하려고 할 때,
    // new 연산자와 달리 생성자가 실행되지 않기 때문에 methods가 등록이 안된다.
    // ex) Error : app.get is not a function
    app.init();

    return app;
};

export default createApplication;

const app = createApplication();

app.get("/", function rootFunc(req, res, next) {
    console.log("hi! this is root!");
    res.send("hi!");
});

app.listen(3000, () => {
    console.log("server opened.");
});
