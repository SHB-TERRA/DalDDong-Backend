//import { getPromiseLists, makePromise, deletePromise, getPromiseDetail, joinPromise } from "../controllers/promiseController";

const getConnection = require('../db.js');

export const getPromiseLists = (req, res) => res.send("getPromiseLists");
export const makePromise = (req, res) => res.send("makePromise");
export const deletePromise = (req, res) => res.send("deletePromise");
export const getPromiseDetail = (req, res) => res.send("getPromiseDetail");
export const joinPromise = (req, res) => res.send("joinPromise");

