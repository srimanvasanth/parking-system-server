const express = require("express");
const cors = require("./config/corsConfig");
const router = require("./config/routerConfig");
const requestLogger = require("./logger");
const cookieParser = require("cookie-parser");
const port = process.env.PORT;

const app = express();

app.use(cors);
app.use(requestLogger);
app.use(express.json());
app.use(express.urlencoded());
app.use(cookieParser());
app.use(router);

app.listen(port, () => {
    console.log('Server started...')
});
