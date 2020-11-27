//import { getPromiseLists, makePromise, deletePromise, getPromiseDetail, joinPromise } from "../controllers/promiseController";
const { Promise, Sequelize: { Op } } = require('../models');

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
    console.log('sent: ' + req.body.user_id);
    try {
        console.log('여기까진?1');
        const promise = await Promise.findOne({
            where: {
                user_id: req.body.user_id,
                date: req.body.date
            }
        });

        if (promise) {
            console.log('여기까진?2');
            return res.status(403).send({ 'message': '이미 이 날짜에 등록된 약속이 있습니다' });
        } else {
            console.log('여기까진?3');
            newPromise = await Promise.create({
                name: req.body.name,
                user_id: req.body.user_id,
                place: req.body.place,
                max_people: req.body.max_people
            });
        };
    } catch (error) {
        return res.status(500).send(error);
    }

    req.newPromise = newPromise.dataValues;
    return next();
}

/*export const makePromise = (req, res) => {
    res.send("makePromise");
}*/

export const deletePromise = (req, res) => {
    res.send("deletePromise");
}

export const getPromiseDetail = (req, res) => {
    res.send("getPromiseDetail");
}

export const joinPromise = (req, res) => {
    res.send("joinPromise");
}

