const { Router } = require("express");
const { User } = require("../models/postgres");
const { ValidationError, where } = require("sequelize");
const { Op, QueryTypes } = require("sequelize");
const connection = require("../models/postgres/db");
const checkAuthentication = require("../middlewares/checkAuthentication");

const router = new Router();

const formatError = (validationError) => {
    return validationError.errors.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
    }, {});
};


router.get("/checkUser", async (req, res) => {
    try {
        if (req.user){
            res.status(200);
            res.send({
                id: req.user.dataValues.id,
                email: req.user.dataValues.email,
                isAdmin: req.user.dataValues.isAdmin
            });
        }else{
            res.status(401);
            res.send({
                success: false
            });
        }
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

module.exports = router;