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

// router.get("/", (req, res, next) => {
//   const userId = req.user.id;
//   //console.log('id', userId);
//   {
//     userId;
//   }
//   return Books.find()
//     .then(books => {
//       console.log("Books", books);
//       res.json(books);
//     })
//     .catch(err => {
//       next(err);
//     });
// });

//get one event by id
// router.get("/:id", jwtAuth, (req, res, next) => {
//   const id = req.params.id;
//   return Books.findById(id)
//     .then(result => {
//       if (result) {
//         res.json(result);
//       } else {
//         next();
//       }
//     })
//     .catch(err => {
//       next(err);
//     });
// });

//create new event
router.post("/", (req, res, next) => {
  const { userId, nuggets } = req.body;

  let nuggetsArray = [];

  function createNugget(nugget, resolve) {
    return Nugget.create(nugget)
      .then(nug => {
        nuggetsArray.push(nug.id);

        return nug.id;
      })
      .catch(err => {
        next(err);
      });
  }
  let nuggetIds = nuggets.map(nugget => {
    return createNugget(nugget);
  });

  Promise.all(nuggetIds)
    .then(() => {
      return res.json(nuggetsArray);
    })
    .catch(err => {
      next(err);
    });
});
module.exports = router;
