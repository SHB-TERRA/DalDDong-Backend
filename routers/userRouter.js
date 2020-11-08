import express from "express";
import routes from "../routes";
import { join, getUserProfile, login, editUser, deleteUser, logout } from "../controllers/userController";

const userRouter = express.Router();

userRouter.post(routes.home, join);
userRouter.get(routes.userDetail(), getUserProfile);
userRouter.post(routes.userDetail(), login);
userRouter.put(routes.userDetail(), editUser);
userRouter.delete(routes.userDetail(), deleteUser);
userRouter.post(routes.logoutSessions, logout);

export default userRouter;
