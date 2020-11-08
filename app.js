import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import bodyParser from "body-parser";
import calendarRouter from "./routers/calendarRouter";
import promiseRouter from "./routers/promiseRouter";
import userRouter from "./routers/userRouter";
import globalRouter from "./routers/globalRouter";
import { localsMiddleware } from "./middlewares";
import routes from "./routes";

var sequelize = require('./models').sequelize;
const app = express();
sequelize.sync();

app.use(helmet());
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(morgan("dev"));
app.use(localsMiddleware);

app.use(routes.home, globalRouter);
app.use(routes.users, userRouter);
app.use(routes.promises, promiseRouter); 
app.use(routes.calendar, calendarRouter);

export default app;