const getConnection = require('../db.js');
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
export const users = (req, res) => res.send("users");
export const userDetail = (req, res) => res.send("userDetail");
export const editProfile = (req, res) => res.send("editProfile");


