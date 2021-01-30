'use strict';

const express = require('express');
const passport = require('../auth/auth');
const router = express.Router();
const usersController = require('../controllers/usersController');
const userValidator = require('../validators/userValidator');

router.get(
  '/',
  usersController.isAuthenticated,
  usersController.getAllUsers,
  usersController.indexView
);
router.get('/new', usersController.new);
router.post(
  '/create',
  userValidator,
  usersController.create,
  passport.authenticate('login', {
    failureRedirect: '/auth/login',
    failureFlash: 'Failed to login.',
    successRedirect: '/users',
    successFlash: 'Logged in!',
  }),
  usersController.redirectView
);
router.get(
  '/:id',
  usersController.isAuthenticated,
  usersController.show,
  usersController.showView
);

module.exports = router;
