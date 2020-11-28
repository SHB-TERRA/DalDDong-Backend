//import { getPromiseLists, makePromise, deletePromise, getPromiseDetail, joinPromise } from "../controllers/promiseController";
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

export const makePromise = async (req, res, next) => {
    let newPromise = '';
    let newParticipant = '';
    console.log('sent: ' + req.body.user_id);
    try {
        const promise = await Promise.findOne({
            where: {
                user_id: req.body.user_id,
                date: req.body.date
            }
        });

        if (promise) {
            return res.status(403).send({ 'message': '이미 이 날짜에 등록된 약속이 있습니다' });
        } else {
            newPromise = await Promise.create({
                name: req.body.name,
                user_id: req.body.user_id,
                place: req.body.place,
                max_people: req.body.max_people,
                date: req.body.date
            });
            newParticipant = await Participant.create({
                user_id: req.body.user_id,
                promise_id: newPromise.id
            });
        };
    } catch (error) {
        return res.status(500).send(error);
    }

    req.newPromise = newPromise.dataValues;
    return next();
}

export const deletePromise = (req, res) => {
    res.send("deletePromise");
}

export const getPromiseDetail = (req, res) => {
    res.send("getPromiseDetail");
}

export const joinPromise = (req, res) => {
    res.send("joinPromise");
}

