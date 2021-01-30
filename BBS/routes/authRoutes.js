'use strict';

const express = require('express');
const passport = require('../auth/auth');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/login', usersController.login);
router.post('/login', passport.authenticate('login', {
  failureRedirect: '/auth/login',
  failureFlash: 'Failed to login.',
  successRedirect: '/users',
  successFlash: 'Logged in!',
}));
router.get('/logout', usersController.logout, usersController.redirectView);

module.exports = router;
