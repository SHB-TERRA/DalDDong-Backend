import express from "express";
import routes from "../routes";
import { getPromiseLists, makePromise, deletePromise, getPromiseDetail, joinPromise } from "../controllers/promiseController";
import { isLogin, isLogOut } from "../middlewares";

const promiseRouter = express.Router();

promiseRouter.get(routes.home, isLogin, getPromiseLists);
promiseRouter.post(routes.home, isLogin, makePromise);

promiseRouter.delete(routes.promiseDetail(), isLogin, deletePromise);
promiseRouter.get(routes.promiseDetail(), isLogin, getPromiseDetail);
promiseRouter.post(routes.promiseDetail(), isLogin, joinPromise);

export default promiseRouter;