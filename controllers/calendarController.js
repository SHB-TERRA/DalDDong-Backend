//import { getCalendar, addPromise } from "../controllers/calendarController";
const getConnection = require('../db.js');

export const getMyCalendar = (req, res) => {
    let result = '';
    res.status(200).json(result);
}
export const addPromise = (req, res) => {
    res.send("addPromise");
}