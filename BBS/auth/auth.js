'use strict';

const express = require('express');
const app = express();
const bcrypt = require('bcrypt');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const User = require('../models').User;

// サインアップ処理
// 作業中
passport.use(
  'signup',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    },
    async (email, password, done) => {
      try {
        const user = await User.create({ email, password });

        return done(null, user);
      } catch (error) {
        done(error);
      }
    }
  )
);

// サインイン処理
passport.use(
  'login',
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password'
    }, 
    (email, password, done) =>  {
      User.findOne({
        where: {
          email: email
        }
      })
      .then(user => {
        if(user && bcrypt.compareSync(password, user.password)) {
          return done(null, user);  // ログイン成功
        }
        throw new Error();
      })
      .catch(error => { // エラー処理
        return done(null, false, { message: 'Incorrect username or password' });
      });
    }
));

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      issuer: process.env.ISSUER,
      audience: process.env.AUDIENCE,
      secretOrKey: process.env.SECRET
    },
    (jwt_payload, done) => {
      User.findOne({where: {id: jwt_payload.id}})
        .then(user => {
          if (user) {
            done(null, user);
          } else {
            done(null, false);
          }
        })
        .catch(err => {
          return done(err, false);
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