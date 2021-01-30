'use strict';

const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models').User;

// サインイン処理
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    (email, password, done) => {
      User.findOne({
        where: {
          email: email,
        },
      })
        .then(user => {
          if (user && bcrypt.compareSync(password, user.password)) {
            return done(null, user); // ログイン成功
          }
          throw new Error();
        })
        // eslint-disable-next-line no-unused-vars
        .catch(error => {
          // エラー処理
          return done(null, false, {
            message: 'Incorrect username or password',
          });
        });
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
