import express from "express";
import routes from "../routes";
import { sendEmail, authEmail, join, getUserProfile, login, editUser, deleteUser, logout } from "../controllers/userController";
import passport from "passport";

const userRouter = express.Router();

userRouter.post(routes.home, join, sendEmail);
userRouter.post(routes.auth, authEmail, login);
userRouter.post(routes.userDetail(), login);
userRouter.get(routes.userDetail(), getUserProfile);
userRouter.put(routes.userDetail(), editUser);
userRouter.delete(routes.userDetail(), deleteUser);
userRouter.post(routes.logoutSessions, logout);

export default userRouter;


