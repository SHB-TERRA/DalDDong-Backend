'use strict';

import passport, { session } from 'passport';
import { LoginCallback } from "./controllers/userController";
const { User, Sequelize: { Op } } = require('./models');

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

    passport.serializeUser(async (user, done) => {
        done(null, user.id);
    });

    //TODO user.id 를 주면 user 정보를 return 할 수 있도록
    passport.deserializeUser(async (id, done) => {
        const user = await getUserById(id);
        done(null, user);
    });

    async function getUserById(id) {
        let user = await User.findOne({ 
            where: { id }
        });

        return user;
    }
}

