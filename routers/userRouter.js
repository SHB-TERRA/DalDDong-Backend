import express from "express";
import routes from "../routes";
import { userDetail, editProfile } from "../controllers/userController";

const userRouter = express.Router();
userRouter.get(routes.userDetail, userDetail);
userRouter.get(routes.editProfile, editProfile);

export default userRouter;
