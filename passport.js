'use strict';

import passport, { session } from 'passport';
import { LoginCallback } from "./controllers/userController";
import smtpTransporter from 'nodemailer-smtp-transport';

const LocalStrategy = require('passport-local').Strategy;

module.exports = () => {
    passport.use(
        new LocalStrategy(
            {
                usernameField: 'email',
                passwordField: 'password',
                session: true,
                passReqToCallBack: false,
            }, LoginCallback
        )
    );

    passport.serializeUser((user, done) => {
        done(null, user);
    });

    //TODO user.id 를 주면 user 정보를 return 할 수 있도록
    passport.deserializeUser((user, done) => {
        done(null, user);
    });
}

