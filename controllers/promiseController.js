//import { getPromiseLists, makePromise, deletePromise, getPromiseDetail, joinPromise } from "../controllers/promiseController";
import moment from 'moment';
const { QueryTypes } = require('sequelize');
const { Promise, Sequelize: { Op }, Participant , sequelize} = require('../models');

export const getPromiseLists = async (req, res) => {
    let result = '';
    try{
        result = await Promise.findAndCountAll({
            where:{
                is_board: true
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json(result);
}

export const makePromise = async (req, res) => {
    let newPromise = '';
    let parsedTime = '';
    let newPariticipant = '';
    try {
        if (req.body.promise_time.length == 5) 
            req.body.promise_time = req.body.promise_time + ":00";
        parsedTime = moment(req.body.promise_day+ ' '+req.body.promise_time, 'YYYY-MM-D HH:mm:ss');
        

        //내 약속 겹치는지 확인
        /*let QUERY = 'SELECT A.user_id FROM users A JOIN ( ' +
                        'SELECT B.promise_time, C.user_id FROM participants C INNER JOIN promises B ON B.id = C.promise_id ) D ' +
                        'ON A.user_id = D.user_id WHERE A.user_id = ' +req.body.user_id + " "
                        'AND DATE_FORMAT(D.promise_time, "%Y-%m-%d") = ' + req.body.promise_day;
        */
        let QUERY = 'SELECT A.user_id FROM users A JOIN ( ' +
            'SELECT B.promise_day, C.user_id FROM participants C INNER JOIN promises B ON B.id = C.promise_id ) D ' +
            'ON A.user_id = D.user_id WHERE A.user_id = ' + req.body.user_id + " " +
            'AND D.promise_day = "'+ req.body.promise_day + '"';

        var result = await sequelize.query(
            QUERY,
            {type: QueryTypes.SELECT});
        
        if (result.length != 0) 
            return res.status(200).json({message: '약속이 겹칩니다'});

        newPromise = await Promise.create({
            meeting_place: req.body.meeting_place,
            place: req.body.place,
            max_people: req.body.max_people,
            promise_day: req.body.promise_day,
            promise_time: req.body.promise_time,
            //promise_time: parsedTime,
            name: req.body.title,
            user_id: req.body.user_id,
            is_board: true
        });

        newPariticipant = await Participant.create({
            promise_id: newPromise.id,
            user_id: newPromise.user_id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json(newPromise);
}

export const deletePromise = async (req, res) => {

    let newPromise = '';
    let newPariticipant = '';

    try {
        newPromise = await Promise.destroy({
            where: {
                id: req.params.id,
                user_id: req.user.user_id
            }
        });

        if (!newPromise) {
            return res.status(500).json({ message: '파라미터 값이 잘못되었습니다' });
        }

        newPariticipant = await Participant.destroy({
            where: {
                promise_id: req.params.id
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json({ message: "success" });
}

export const getPromiseDetail = async (req, res) => {

    let newPromise = '';
    try {
        newPromise = await Promise.findAll({
            where: {
                id: req.params.id
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    
    return res.status(200).json(newPromise);

}

export const joinPromise = async (req, res) => {
    let promise = '';
    let result = '';
    let newPariticipant = '';

    try {
        promise = await Promise.findOne({
            where: {
                id: req.params.id
            }
        });

        var now = moment().format("YYYY-MM-D HH:mm:ss").toString();
        
        var LIMIT_TIME = 30;
        var DIFF_TIME = moment.utc(moment(promise.promise_day + " " + promise.promise_time, "YYYY-MM-D HH:mm:ss").diff(moment(now, "YYYY-MM-D HH:mm:ss"))).format("mm");
        console.log("##1  " + moment(promise.promise_day + ' ' + promise.promise_time, "YYYY-MM-D HH:mm:ss"));
        console.log("##2  " + moment(now, "YYYY-MM-D HH:mm:ss"));

        if (DIFF_TIME < LIMIT_TIME) {
            return res.status(403).send({ message: '이미 약속참가 시간이 지났습니다.' });
        }

        result = await Participant.findAndCountAll({
            where: {
                promise_id: promise.id
            }
        });
        
        if ((promise.maxPeople <= result.count)) {
            return res.status(403).send({ message: '이미 약속이 다 찼습니다' });
        }
        //내가 같은 약속 참가 할 수 없도록.
        var tmpParticipant = await Participant.findAll({
            where:{
                promise_id: promise.id,
                user_id: req.body.user_id
            }
        });

        if ( tmpParticipant.length > 0 ) 
            return res.status(403).send({ message: '이미 등록한 약속입니다' });

        //내 약속 겹치는지 확인
        /*let QUERY = "SELECT A.user_id FROM users A JOIN ( " + 
                        "SELECT B.promise_time, C.user_id FROM participants C INNER JOIN promises B ON B.id = C.promise_id ) D " +
                        "ON A.user_id = D.user_id WHERE A.user_id = " +req.body.user_id + " "+
                        "AND DATE_FORMAT(D.promise_time, '%Y-%m-%d') = DATE_FORMAT('" + promise.promise_time + "', '%Y-%m-%d')";*/

        let QUERY = "SELECT A.user_id FROM users A JOIN ( " +
            "SELECT B.promise_day, C.user_id FROM participants C INNER JOIN promises B ON B.id = C.promise_id ) D " +
            "ON A.user_id = D.user_id WHERE A.user_id = " + req.body.user_id + " " +
            "AND D.promise_day = '" + promise.promise_day + "'";

        var myPromiseOnDay = await sequelize.query(
            QUERY,
            {type: QueryTypes.SELECT});
        
        if (myPromiseOnDay.length != 0) 
            return res.status(200).json({message: '약속이 겹칩니다'});

        newPariticipant = await Participant.create({
            promise_id: promise.id,
            user_id: req.body.user_id
        });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }

    return res.status(200).json(newPariticipant);
}
