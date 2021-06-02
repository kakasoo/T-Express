# T-Express

I've heard that somewhere, the best way to understand frogs is to create frogs, not dissect them.  
In this saying, I experience reading and following the code in express.js.  
I hope this helps those who have learned the latest JavaScript grammar.

# how to use?

I am writing the same grammar code as Express.js.  
I will mention only the parts that have been implemented separately.

```bash
$ npm install -g TExpress
```

# Available feature

```javascript
const http = require("http");
const TExpress = require("@kakasoo/t-express");

const app = TExpress();
const PORT = 3000;

app.use((req, res, next) => {
    console.log(123);
    next();
});

app.get("/", (req, res, next) => res.send("send root."));

const server = http.createServer(app);
server.listen(PORT, () => console.log("Server is opened."));
```

-   Opening a server
-   middleware

# To be implemented

-   Code based on ES6 Only ( Not using the Object methods )
-   Reliable middleware capabilities
-   Custom Response methods
    -   res.send()
    -   res.render()
-   Data delivery through params, body and query
-   Error handling using next()

# if you're Korean...

Maybe this is good for you.  
[Express는 어떻게 만들어졌을까? : Router, Route, Layer](https://velog.io/@kakasoo/Express%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%A7%8C%EB%93%A4%EC%96%B4%EC%A1%8C%EC%9D%84%EA%B9%8C)  
[Express는 어떻게 만들어졌을까? : 미들웨어 편](https://velog.io/@kakasoo/Express%EB%8A%94-%EC%96%B4%EB%96%BB%EA%B2%8C-%EB%A7%8C%EB%93%A4%EC%96%B4%EC%A1%8C%EC%9D%84%EA%B9%8C-2)
