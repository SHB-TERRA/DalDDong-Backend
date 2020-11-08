const getConnection = require('../db.js');
// import { join, getUserProfile, login, editUser, deleteUser } from "../controllers/userController";

export const home = async (req, res) => {
    console.log("home test")
    try {
        getConnection((conn) => {
            conn.query("SELECT COUNT(*) FROM lunch");
            if (conn) conn.release();
        });
    } catch (error){
        console.log(error);
        res.send(500);
    } 

    res.send(200);
};

export const join = (req, res) => res.send("Join");
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const getUserProfile = (req, res) => res.send("getUserProfile");
export const editUser = (req, res) => res.send("editUser");
export const deleteUser = (req, res) => res.send("deleteUser");


