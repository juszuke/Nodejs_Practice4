'use strict';

const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const userValidator = require('../validators/userValidator');

router.get('/', usersController.isAuthenticated, usersController.getAllUsers, usersController.indexView);
router.get('/new', usersController.new);
router.post(
  '/create',
  userValidator,
  usersController.validate,
  usersController.create,
  usersController.authenticate,
  usersController.redirectView
);
router.get('/:id', usersController.isAuthenticated, usersController.show, usersController.showView);

module.exports = router;
