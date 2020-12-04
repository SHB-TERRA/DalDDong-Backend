import express from "express";
import routes from "../routes";
import { getMyCalendar, addPromise, deleteMyPromise } from "../controllers/calendarController";

const calendarRouter = express.Router();

calendarRouter.get(routes.userDetail(), getMyCalendar);
calendarRouter.post(routes.userDetail(), addPromise);
calendarRouter.delete(routes.promiseDetail(), deleteMyPromise);

export default calendarRouter;