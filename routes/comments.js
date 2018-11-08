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
  //req.user.id
  console.log("req.body", req.body);
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
      console.log("createdComment>>>>>>>>>>>>>>>", createdComment);
      res
        .status(201)

        .json(createdComment);
    })
    .catch(err => next(err));
  //.location(`${req.originalUrl}/${createdComment.id}`)
  //   Books.findbyIdandUpdate(
  //     { _id: bookId },
  //     { $push: { comments: comment } },
  //     done
  //   )
  //     .then(result => {
  //       if (result) {
  //         res.json(result);
  //       } else {
  //         next();
  //       }
  //     })
  //     .catch(err => {
  //       if (err.code === 11000) {
  //         err = new Error("Tag name already exists");
  //         err.status = 400;
  //       }
  //       next(err);
  //     });
});

module.exports = router;
// console.log("req.body", req.body);
// const userId = req.user.id;
// //const userId = req.body.bookData.userId;
// //console.log("userid", userId);

// const { nuggetIds, bookData } = req.body;
// bookData.nuggets = nuggetIds;
// //console.log("BOOK DATA +++++", bookData);

// Books.create(bookData)
//   .then(createdBook => {
//     res
//       .location(`${req.originalUrl}/${createdBook.id}`)
//       .status(201)
//       .json(createdBook);
//   })
//   .catch(err => next(err));
//Book.findById('asdads').populate('nuggets').then()

// let nuggetsArray = [];
// nuggetIds.map(nuggetId => {
//   console.log("nuggetid in book map", nuggetId);
//   let nugget = Nugget.findOne({ _id: nuggetId });
//   console.log("nugget in book map", nugget);
//   return nuggetsArray.push(nugget);
// });

//bookData.nugget

// console.log("new book", newBook);
// if (!newBook.title) {
//   const err = new Error("Missing `title` in request body");
//   err.status = 400;
//   return next(err);
// }
