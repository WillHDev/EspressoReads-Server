"use strict";
const express = require("express");
const Books = require("../models/book-schema");
const Nugget = require("../models/nugget-schema");
const Comment = require("../models/comment-schema");
const User = require("../models/user-schema");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jsonParser = bodyParser.json();

const jwtAuth = passport.authenticate("jwt", {
  session: false,
  failWithError: true
});

router.use(jsonParser);

//create new event
router.post("/", jwtAuth, (req, res, next) => {
  const { book, comment, userId } = req.body;
  User.findById(userId)
    .then(user => {
      return user.username;
    })
    .then(username => {
      return Comment.create({
        text: comment,
        author: username
      });
    })
    .then(createdComment => {
      res
        .status(201)

        .json(createdComment);
    })
    .catch(err => next(err));
});

module.exports = router;
