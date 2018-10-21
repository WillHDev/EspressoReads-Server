'use strict';
const express = require('express');
const Books = require('../models/book-schema');
const router = express.Router();
const passport = require('passport');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const jsonParser = bodyParser.json();
const User = require('../models/user-schema');
const jwtAuth = passport.authenticate('jwt', { session: false, failWithError: true });

router.use(jsonParser);

router.get('/', jwtAuth, (req, res, next) => {
    const userId = req.user.id;
return Books.find({ userId })
.then( books => {
    res.json(books)
})
.catch(err => {
    next(err);
  });
});


//get one event by id
router.get('/:id', jwtAuth, (req, res, next) => {
    const id = req.params.id;
    return Books.findById(id)
      .then(result => {
        if(result){
          res.json(result);
        }else{
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  });
  
  
  
  //create new event
  router.post('/', jwtAuth, (req, res, next) => {
   
    const userId = req.user.id; 
    const {title, description, subtitle, author, URL, podcasts} = req.body;
    const newEvent = {
      userId,
      title,
      subtitle,
      description,
      tags,
      author,
      URL,
      podcasts
    };
  
    if(!newEvent.title){
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }
  
    Event.create(newEvent)
      .then( createdEvent => {
        res
          .location(`${req.originalUrl}/${createdEvent.id}`)
          .status(201)
          .json(createdEvent);
      })
      .catch(err => next(err));
  });
  
  
  
  //edit event
  router.put('/:id', jwtAuth, (req, res, next) => {
    
    const {id} = req.params;
  
    const {title, description, scheduleOptions, restaurantOptions, activityOptions, draft, location, locationCity} = req.body;
  
    const userId = req.user.id;
    const updatedEvent = {
      userId,
      title,
      description,
      location,
      locationCity,
      scheduleOptions,
      restaurantOptions,
      activityOptions,
      draft
    };
    //validate id
    if(!mongoose.Types.ObjectId.isValid(id)){
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
    if(!updatedEvent.title){
      const err = new Error('Missing `title` in request body');
      err.status = 400;
      return next(err);
    }
  
    Event.findOneAndUpdate({_id:id, userId}, updatedEvent, {new: true})
      .then(result => {
        if(result){
          res.json(result)
            .status(200);
        }
        else{
          next();
        }
      })
      .catch(err => {
        next(err);
      });
  });
  
  
  
  //delete event
  router.delete('/:id', jwtAuth, (req, res, next) => {
    const {id} = req.params;
    const userId = req.user.id;
    if(!mongoose.Types.ObjectId.isValid(id)){
      const err = new Error('The `id` is not valid');
      err.status = 400;
      return next(err);
    }
  
    Event.findOneAndRemove({_id:id, userId})
      .then(() => {
        res.sendStatus(204).end();
      })
      .catch(err => {
        next(err);
      });
  });
  


module.exports = router;