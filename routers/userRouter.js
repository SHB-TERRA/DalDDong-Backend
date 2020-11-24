import express from "express";
import routes from "../routes";
import { sendEmail, authEmail, join, getUserProfile, login, editUser, deleteUser, logout } from "../controllers/userController";
import { isLogin, isLogOut } from "../middlewares";

const userRouter = express.Router();

userRouter.post(routes.home, isLogOut, join, sendEmail);
userRouter.post(routes.auth, isLogOut, authEmail, login);
userRouter.post(routes.login, login);
userRouter.get(routes.userDetail(), isLogin, getUserProfile);
userRouter.put(routes.userDetail(), isLogin, editUser);
userRouter.delete(routes.userDetail(), deleteUser);
userRouter.post(routes.logout, logout);

export default userRouter;


