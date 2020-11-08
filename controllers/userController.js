// const getConnection = require('../db.js');
const { User, Sequelize: { Op } } = require('../models');

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

export const join = async (req, res, next) => {
    let newUser = '';
    try{
        newUser = await User.create({
            name: req.body.name,
            email: req.body.email,
            user_id: req.body.userId,
            password: req.body.password
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send(error);
    }
    return res.status(200).json(newUser);
}
export const login = (req, res) => res.send("Login");
export const logout = (req, res) => res.send("Logout");
export const getUserProfile = (req, res) => {
    let result = User.findAll({
        attributes: ['id', 'name'],
        limit: 1,
        offset: 1,
      });
    res.status(200).json(result);
}

export const editUser = (req, res) => res.send("editUser");
export const deleteUser = (req, res) => res.send("deleteUser");


