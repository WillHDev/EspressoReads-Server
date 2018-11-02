"use strict";
const express = require("express");
const Books = require("../models/book-schema");
const Nugget = require("../models/nugget-schema");
const router = express.Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const jsonParser = bodyParser.json();
const User = require("../models/user-schema");
const jwtAuth = passport.authenticate("jwt", {
  session: false,
  failWithError: true
});

router.use(jsonParser);

router.get("/", (req, res, next) => {
  return Books.find()
    .populate("nuggets")
    .sort({ vote: 1 })
    .populate("comments")
    .then(books => {
      //console.log("Books JSON", books);
      res.json(books);
    })
    .catch(err => {
      next(err);
    });
});
//get one event by id
router.get("/:id", jwtAuth, (req, res, next) => {
  const id = req.params.id;
  return Books.findById(id)
    .then(result => {
      if (result) {
        res.json(result);
      } else {
        next();
      }
    })
    .catch(err => {
      next(err);
    });
});

//create new event
router.post("/", jwtAuth, (req, res, next) => {
  // console.log("req.body", req.body);
  const userId = req.user.id;
  //const userId = req.body.bookData.userId;
  //console.log("userid", userId);

  const { nuggetIds, bookData } = req.body;
  bookData.nuggets = nuggetIds;
  //console.log("BOOK DATA +++++", bookData);

  Books.create(bookData)
    .then(createdBook => {
      res
        .location(`${req.originalUrl}/${createdBook.id}`)
        .status(201)
        .json(createdBook);
    })
    .catch(err => next(err));
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
});

//edit event
router.put("/:id", jwtAuth, (req, res, next) => {
  const { id } = req.params;

  if (req.body.voteAction) {
    const { voteAction } = req.body;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      const err = new Error("The `id` is not valid");
      err.status = 400;
      return next(err);
    }
    function changeVote(voteAction) {
      if (voteAction === "down") {
        return Books.findByIdAndUpdate(id, { $inc: { votes: -1 } });
        // .then(() => {
        //   Books.update({ _id: id, votes: { $lt: 0 } }, { $set: { score: 0 } });
        // });
      } else {
        return Books.findByIdAndUpdate(id, { $inc: { votes: 1 } });
      }
    }
    changeVote(voteAction)
      .then(result => {
        if (result) {
          res.json(result).status(200);
        } else {
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  } else {
    const bookId = req.params;
    const createdCommentId = req.body.id;
    console.log("createdCommentId", createdCommentId);
    console.log("req.body", req.body);
    //console.log("createdComment", createdComment);
    //console.log("bookid", bookId);
    //Books.update({ id: bookId }, { $push: { comments: createdCommentId } })
    console.log("bookId", bookId);

    return Books.findById({ _id: bookId.id })
      .then(book => {
        //console.log("book", book);
        if (!book.comments) {
          // console.log("book if statement", book);
          const array = [];
          book.comments = array.push(createdCommentId);
        } else {
          book.comments.push(createdCommentId);
        }
        // console.log("book before save", book);
        //book.save();
        return book;
      })
      .then(result => {
        if (result) {
          console.log("result", result);

          res.json(result);
        } else {
          next();
        }
      })
      .catch(err => {
        // if (err.code === 11000) {
        //   err = new Error("Tag name already exists");
        //   err.status = 400;
        // }
        next(err);
      });
  }
});
//validate id

// if (!updatedBook.title) {
//   const err = new Error("Missing `title` in request body");
//   err.status = 400;
//   return next(err);
// }

// Books.findOneAndUpdate({ _id: id, userId }, updatedBook, { new: true })

//delete event
router.delete("/:id", jwtAuth, (req, res, next) => {
  const { id } = req.params;
  const userId = req.user.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("The `id` is not valid");
    err.status = 400;
    return next(err);
  }

  Books.findOneAndRemove({ _id: id, userId })
    .then(() => {
      res.sendStatus(204).end();
    })
    .catch(err => {
      next(err);
    });
});

module.exports = router;
