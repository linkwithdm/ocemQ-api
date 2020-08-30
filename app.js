const express = require("express");
const logger = require("morgan");
const app = express();

app.set("port", 3333);
app.use(logger("dev"));
require("./configs/mongoose");

const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger.json");

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRouter = require("./controllers/auth.controller");
const userRouter = require("./controllers/user.controllers");
const questionRouter = require("./controllers/question.controller");

//mount all incoming request
app.use("/auth", authRouter);
app.use("/user", userRouter);
app.use("/question", questionRouter);

//port listening

var server_port = process.env.YOUR_PORT || process.env.PORT || 80;
var server_host = process.env.YOUR_HOST || "0.0.0.0";
app.listen(server_port, server_host, (err, done) => {
  if (err) {
    console.log("Error while listening port " + app.get("port") + " >> " + err);
  } else {
    console.log("Server is listening at port " + app.get("port"));
  }
});

app.use((req, res, next) => {
  next({
    msg: "Error",
    status: 404,
  });
});

app.use((err, req, res, next) => {
  res.json({
    msg: err.msg || err,
    status: err.status || 400,
  });
});
