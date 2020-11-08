import express from "express";
import routes from "../routes";
import { getMyCalendar, addPromise } from "../controllers/calendarController";

const calendarRouter = express.Router();

calendarRouter.get(routes.userDetail(), getMyCalendar);
calendarRouter.put(routes.userDetail(), addPromise);

export default calendarRouter;