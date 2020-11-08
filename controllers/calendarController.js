//import { getCalendar, addPromise } from "../controllers/calendarController";
// const getConnection = require('../db.js');
const { User, Promise, Participant, Sequelize: { Op } } = require('../models');

export const getMyCalendar = async (req, res, next) => {
    let result = '';
    try {
        result = await Participant.findAll({
            include:[{
                model: Promise,
                attribuutes: ['date']
            },
            {
                model: User,
                attribute: ['user_id']
            }],
            where:{
                user_id: req.body.userId
            }
        });
        console.log(result);
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json(result);
}
export const addPromise = (req, res) => {
    res.send("addPromise");
}