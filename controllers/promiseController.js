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

export const makePromise = (req, res) => {
    res.send("makePromise");
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

