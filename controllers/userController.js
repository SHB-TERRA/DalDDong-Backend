// const getConnection = require('../db.js');
import crypto from 'crypto';
import passport from 'passport';
import nodemailer from 'nodemailer';
import smtpTransporter from 'nodemailer-smtp-transport';
import { resourceUsage } from 'process';

const { User, Sequelize: { Op } } = require('../models');

export const home = (req, res) => {
    return res.status(200).json({'success':'home'});
};

export const join = async (req, res, next) => {
    let newUser = '';
    try{
        const user = await User.findOne({ 
            where: {email: req.body.email}
        });

        if (user) {
          return res.status(403).send({'message':'이미 등록된 이메일이 있습니다'});
        } else{
            var key_for_verify = generateKey();
    
            newUser = await User.create({
                name: req.body.name,
                email: req.body.email,
                user_id: req.body.user_id,
                password: crypto.createHash('sha512').update(req.body.password).digest('base64'),
                key_for_verify
            });
        };
    } catch (error) {
        return res.status(500).send(error);
    }
    req.newUser = newUser.dataValues;
    return next();
}

const generateKey = () => {
    var key_one=crypto.randomBytes(256).toString('hex').substr(100, 5);
    var key_two=crypto.randomBytes(256).toString('base64').substr(50, 5);
    var key_for_verify=key_one+key_two;

    return key_for_verify;
}

export const sendEmail = (req, res) => {
    
    var mailOptions = {
        from: process.env.EMAIL_ID,
        to: req.newUser.email,
        subject: 'DALDDONG 회원가입을 위한 인증번호',
        text: '인증번호: '+ req.newUser.key_for_verify
    };

    let transporter = nodemailer.createTransport(smtpTransporter({
        service: 'gmail',
        host:'smtp.gmail.com',
        auth:{
            user: process.env.EMAIL_ID,
            pass: process.env.EMAIL_PWD
        }
    }));

    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
          return res.status(500).json({message: '이메일 전송 실패'});
        } 
        console.log('Email sent: ' + info.response);
    });

    return res.status(200).json(req.newUser);
}

//이메일 인증
export const authEmail = async(req, res, next) => {
    let user = '';
    try{
        user = await User.findOne({ 
            where: {
                email: req.body.email,
                password: crypto.createHash('sha512').update(req.body.password).digest('base64')
            }
        });
        
        if( user.key_for_verify == req.body.key_for_verify ){
            user = await User.update({ email_verified: true }, {
                where: {
                    email: req.body.email,
                    password: crypto.createHash('sha512').update(req.body.password).digest('base64')
                }
              });
        }else{
            return res.status(500).json({message: "인증번호가 일치하지 않습니다"});
        }

    }catch(error){
        return res.status(500).send(error);
    }
    return next();
}

export const LoginCallback = async( email, password, done ) => {
    
    try{
        const user = await User.findOne({ 
            where: {
                email: email,
                password: crypto.createHash('sha512').update(password).digest('base64')}
        });

        if (!user) {
          return done(null, false, {message: '일치하는 정보가 없습니다'});
        }

        if(!user.key_for_verify) {
            return done(null, false, {message: '이메일 인증이 필요합니다'});
        }
        
        return done(null, user);
        
    } catch (err) {
        return done(null, false, {meessage: '서버 에러'});      
    } 
}

export const login = async (req, res, next) => {

    passport.authenticate('local', (err, user, info) => {
        
        if (err) {
            return next(err);
        }
        if (!user) {
            return res.status(403).json({
                info,
                result: '로그인 실패'
            });
        }
   
        req.logIn(user, function(err) {
            if (err) return next(err);
            user = req.user;
            return res.status(200).json(user);
        });

    })(req, res, next);
}

export const logout = (req, res) => {
    req.logout();
    return res.json({'message':'logout success'});
}

export const getUserProfile = (req, res) => {
    const info = req.user;
    return res.json(info);
}

export const editUser = async (req, res) => {
    let user = '';

    try {

        user = await User.findOne({ 
            where: {
                id: req.params.id
            }
        });

        if( user.id != req.user.id) return res.status(403).json({message: '잘못된 요청입니다'});

        if (!user) return res.status(403).json({message: '일치하는 유저 정보가 없습니다.'});

        if ( !req.body.nickname || req.body.nickname.length == 0) req.body.nickname = user.nickname;
        if ( !req.body.password || req.body.password.length == 0) {
            req.body.password = user.password;
        } else{
            req.body.password = crypto.createHash('sha512').update(req.body.password).digest('base64');
        }

        await User.update({ 
            nickname: req.body.nickname,
            password: req.body.password,
        }, {
            where: {
                id: req.params.id
            }
        });
        
    } catch (error){
        console.log(error)
        return res.status(500).send(error);
    }
    req.user.nickname = req.body.nickname;
    return res.status(200).json(req.user);
}

export const deleteUser = async (req, res) => {
    let user = '';
    try {
        user = await User.findOne({ 
            where: {
                id: req.params.id
            }
        });
        if (!user) return res.status(403).json({message: '일치하는 유저 정보가 없습니다.'});

        user = await User.delete({
            where: {
                id: req.params.id
            }
          });

    } catch (error){
        return res.status(500).send(error);
    }
}

