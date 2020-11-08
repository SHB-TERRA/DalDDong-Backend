import express from "express";
import routes from "../routes";
import { getCalendar, addPromise } from "../controllers/calendarController";

const calendarRouter = express.Router();

calendarRouter.get(routes.userDetail(), getCalendar);
calendarRouter.put(routes.userDetail(), addPromise);

export default calendarRouter;