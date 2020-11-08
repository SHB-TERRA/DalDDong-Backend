//import { getCalendar, addPromise } from "../controllers/calendarController";
const getConnection = require('../db.js');

export const getCalendar = (req, res) => res.send("getCalendar");
export const addPromise = (req, res) => res.send("addPromise");