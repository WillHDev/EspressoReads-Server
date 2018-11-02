"use strict";

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const passport = require("passport");
const { jwtStrategy } = require("./auth/strategies");
const { localStrategy } = require("./auth/strategies");

const { PORT, CLIENT_ORIGIN } = require("./config");
const { dbConnect } = require("./db-mongoose");
// const {dbConnect} = require('./db-knex');
const authRouter = require("./routes/auth");
const usersRouter = require("./routes/users");
const userBooksRouter = require("./routes/userBooks");
const booksRouter = require("./routes/books");
const nuggetsRouter = require("./routes/nuggets");
const commentsRouter = require("./routes/comments");

const app = express();

app.use(
  morgan(process.env.NODE_ENV === "production" ? "common" : "dev", {
    skip: (req, res) => process.env.NODE_ENV === "test"
  })
);

app.use(
  cors({
    origin: CLIENT_ORIGIN
  })
);

app.use(express.json());

passport.use(localStrategy);
passport.use(jwtStrategy);

app.use("/api/users", usersRouter);
app.use("/api/login", authRouter);
app.use("/api/userbooks", userBooksRouter);
app.use("/api/books", booksRouter);
app.use("/api/nuggets", nuggetsRouter);
app.use("/api/comments", commentsRouter);

//custom 404 not found handler
app.use((req, res, next) => {
  const err = new Error("Not Found");
  err.status = 404;
  console.log("err", err);

  next(err);
});
//Custom error handler
app.use((err, req, res, next) => {
  if (err.status) {
    const errBody = Object.assign({}, err, { message: err.message });
    res.status(err.status).json(errBody);
  } else {
    console.error(err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
});

// app.use(
//   morgan(process.env.NODE_ENV === 'production' ? 'common' : 'dev', {
//     skip: (req, res) => process.env.NODE_ENV === 'test'
//   })
// );

function runServer(port = PORT) {
  const server = app
    .listen(port, () => {
      console.info(`App listening on port ${server.address().port}`);
    })
    .on("error", err => {
      console.error("Express failed to start");
      console.error(err);
    });
}

if (require.main === module) {
  dbConnect();
  runServer();
}

module.exports = app;
