import express from "express";
import routes from "../routes";
import { getMyCalendar, addPromise, deleteMyPromise } from "../controllers/calendarController";
import { isLogin, isLogOut } from "../middlewares";

const calendarRouter = express.Router();

calendarRouter.get(routes.userDetail(), isLogin, getMyCalendar);
calendarRouter.post(routes.userDetail(), isLogin, addPromise);
calendarRouter.delete(routes.promiseDetail(), isLogin, deleteMyPromise);

export default calendarRouter;
