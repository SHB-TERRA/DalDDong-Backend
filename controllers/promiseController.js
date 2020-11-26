//import { getPromiseLists, makePromise, deletePromise, getPromiseDetail, joinPromise } from "../controllers/promiseController";
import moment from 'moment';

const { Promise, Sequelize: { Op }, Participant } = require('../models');

export const getPromiseLists = async (req, res) => {
    let result = '';
    try{
        result = await Promise.findAndCountAll();
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json(result);
}

export const makePromise = async (req, res) => {
    let newPromise = '';
    let parsedTime  = '';
    let newPariticipant = '';
    try {
        parsedTime = moment(req.body.promise_time, 'YYYY-MM-D HH:mm:ss');
        
        newPromise = await Promise.create({
            meeting_place: req.body.meeting_place,
            place: req.body.place,
            max_people: req.body.max_people,
            promise_time: parsedTime,
            name: req.body.title,
            user_id: req.body.user_id
            // user_id: req.user.user_id TODO user_id 필수 구현 후 이 코드로 변경
        });

        newPariticipant = await Participant.create({
            promise_id: newPromise.id,
            user_id: newPromise.user_id
        });

    } catch ( error ) {
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
            return res.status(500).json({message: '등록한 사람만 삭제가 가능합니다'});
        }

        newPariticipant = await Participant.destroy({
            where: {
                promise_id: req.params.id
            }
        });

    } catch ( error ) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json({message: "success"});
}

export const getPromiseDetail = async (req, res) => {

    let newPromise = '';
    try {
        newPromise = await Promise.findAll({
            where: {
                id: req.body.promise_id
            }
        });
    } catch ( error ) {
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
        promise = await Promise.findAll({
            id: req.params.id
        });
        
        var now = moment().format("YYYY-MM-D HH:mm:ss").toString();

        var LIMIT_TIME = 30;
        var DIFF_TIME = moment.utc(moment(promise.promise_time,"DD/MM/YYYY HH:mm:ss").diff(moment(now, "YYYY-MM-D HH:mm:ss"))).format("mm");
        
        if ( DIFF_TIME < LIMIT_TIME ){
            return res.status(403).send({message: '이미 기간이 만료된 약속입니다.'})
        }
        
        result = await Participant.findAndCountAll({
            where: {
                id: req.params.id
            }
        });
        
        if ( (promise.maxPeople <= result.count)){
            return res.status(403).send({message: '이미 완료된 약속입니다.'})
        }
        
        newPariticipant = await Participant.create({
            promise_id: promise.id,
            user_id: req.user.user_id
        });
        
    } catch ( error ) {
        console.log(error);
        return res.status(500).send(error);
    }

    return res.status(200).json(newPariticipant);
}

