"use strict";
const express = require("express");
const Books = require("../models/book-schema");
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

router.get("/", jwtAuth, (req, res, next) => {
  const userId = req.user.id;

  return Books.find({ userId })
    .then(books => {
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
  const userId = req.user.id;
  const {
    title,
    description,
    subtitle,
    author,
    URL,
    podcasts,
    tags,
    image
  } = req.body;
  const newBook = {
    userId,
    title,
    subtitle,
    description,
    tags,
    author,
    URL,
    podcasts,
    image
  };

  if (!newBook.title) {
    const err = new Error("Missing `title` in request body");
    err.status = 400;
    return next(err);
  }

  Books.create(newBook)
    .then(createdBook => {
      res
        .location(`${req.originalUrl}/${createdBook.id}`)
        .status(201)
        .json(createdBook);
    })
    .catch(err => next(err));
});

//edit event
router.put("/:id", jwtAuth, (req, res, next) => {
  const { id } = req.params;

  const userId = req.user.id;
  const {
    title,
    description,
    subtitle,
    author,
    URL,
    podcasts,
    tags,
    image
  } = req.body;
  const updatedBook = {
    userId,
    title,
    subtitle,
    description,
    tags,
    author,
    URL,
    image,
    podcasts
  };
  //validate id
  if (!mongoose.Types.ObjectId.isValid(id)) {
    const err = new Error("The `id` is not valid");
    err.status = 400;
    return next(err);
  }
  if (!updatedBook.title) {
    const err = new Error("Missing `title` in request body");
    err.status = 400;
    return next(err);
  }

  Books.findOneAndUpdate({ _id: id, userId }, updatedBook, { new: true })
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
});

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
