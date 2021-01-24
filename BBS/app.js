'use strict';

const express = require('express');
const app = express();
const passport = require('./auth/auth');
const config = require('./config/config');
const cookieParser = require('cookie-parser');
const layouts = require('express-ejs-layouts');
const expressSession = require('express-session');
const bodyParser = require('body-parser');
const connectFlash = require('connect-flash');
const logger = require('morgan');

const router = require('./routes/index');

// view engine setup
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'ejs');
app.set('superSecret', config.secret);

app.use(logger('dev'));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(
  expressSession({
    secret: 'secretLogIn123',
    cookie: {
      maxAge: 4000000,
    },
    resave: false,
    saveUninitialized: false,
  })
);
app.use(connectFlash());
app.use(express.static('public'));
app.use(layouts);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use('/', router);

module.exports = app;
