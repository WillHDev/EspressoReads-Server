
'use strict';

const express = require('express');
const passport = require('passport');
const jwt = require('jsonwebtoken');
const { JWT_SECRET, JWT_EXPIRY } = require('../config');

const router = express.Router();


const createAuthToken = function(user) {
  
    return jwt.sign({user}, JWT_SECRET, {
      subject: user.username,
      expiresIn: JWT_EXPIRY,
      algorithm: 'HS256'
    });
  };
  
  const localAuth = passport.authenticate('local', {session: false});
  
  router.post('/', localAuth, (req, res) => {
    console.log('Hit');
    const authToken = createAuthToken(req.user);
    console.log('token', authToken);
    return res.json({authToken});
  });
  
  const jwtAuth = passport.authenticate('jwt', {session: false});
  
  router.post('/refresh', jwtAuth, (req, res) => {
    const authToken = createAuthToken(req.user);
    res.json({authToken});
  });
  
  module.exports = router;