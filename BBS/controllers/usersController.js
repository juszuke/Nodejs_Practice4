'use strict';

const User = require('../models').User;
const passport = require('passport');
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');
const getUserParams = (body) => {
  return {
    name: body.name,
    email: body.email,
    password: bcrypt.hashSync(body.password, bcrypt.genSaltSync(8)),
  };
};

module.exports = {
  getAllUsers: (req, res, next) => {
    User.findAll()
      .then((users) => {
        res.locals.users = users;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching users: ${error.message}`);
        next(error);
      });
  },

  indexView: (req, res) => {
    res.render('users/index');
  },

  new: (req, res) => {
    res.render('users/new');
  },

  create: (req, res, next) => {
    if (req.skip) return next();
    const newUser = new User(getUserParams(req.body)).dataValues;
    User.create(newUser)
      .then((e, user) => {
        if (user) {
          req.flash(
            'success',
            `${user.name}'s account created successfully!`
            );
            res.locals.redirect = '/users';
            next();
          } else {
          req.flash(
            'error',
            `Failed to create user account because: ${e.message}`
            );
            res.locals.redirect = '/users/new';          
            next();
          }
      });
  },
    
    redirectView: (req, res, next) => {
    const redirectPath = res.locals.redirect;
    if (redirectPath) res.redirect(redirectPath);
    else next();
  },

  show: (req, res, next) => {
    const userId = req.params.id;
    User.findById(userId)
      .then((user) => {
        res.locals.user = user;
        next();
      })
      .catch((error) => {
        console.log(`Error fetching user by ID: ${error.message}`);
        next(error);
      });
  },

  showView: (req, res) => {
    res.render('users/show');
  },

  login: (req, res) => {
    res.render('auth/login');
  },

  validate: (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const messages = errors.array().map((e) => e.msg);
      req.skip = true;
      req.flash('error', messages.join(' and '));
      res.locals.redirect = '/users/new';
      next();
    } else {
      next();
    }
  },

  // authenticate: passport.authenticate('local', {
  //   failureRedirect: '/auth/login',
  //   failureFlash: 'Failed to login.',
  //   successRedirect: '/users',
  //   successFlash: 'Logged in!',
  // }),

  authenticate: passport.authenticate('jwt', {
    failureRedirect: '/auth/login',
    failureFlash: 'Failed to login.',
    successRedirect: '/users',
    successFlash: 'Logged in!',
    session: false
  }),

  logout: (req, res, next) => {
    req.logout();
    req.flash('success', 'You have been logged out!');
    res.locals.redirect = '/auth/login';
    next();
  },
};
