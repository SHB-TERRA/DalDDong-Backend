import express from "express";
import routes from "../routes";
import { getPromiseLists, makePromise, deletePromise, getPromiseDetail, joinPromise } from "../controllers/promiseController";

const promiseRouter = express.Router();

promiseRouter.get(routes.home, getPromiseLists);
promiseRouter.post(routes.home, makePromise);

promiseRouter.delete(routes.promiseDetail(), deletePromise);
promiseRouter.get(routes.promiseDetail(), getPromiseDetail);
promiseRouter.post(routes.promiseDetail(), joinPromise);

export default promiseRouter;