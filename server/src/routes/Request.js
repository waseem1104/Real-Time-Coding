const {Router} = require("express");
const {Request, User} = require("../models/postgres");
const connection = require("../models/postgres/db");
const {ValidationError, Op, QueryTypes} = require("sequelize");

const router = new Router();

router.post("/new", async (req, res) => {
    const advisor = req.body.advisor
    const request_id = req.body.request_id
    try {
        const result = await Request.create({
            advisor: advisor,
            userid: req.user.dataValues.id,
            request_id: request_id
        });
        res.status(201).json(result);
    } catch (error) {
        if (error instanceof ValidationError) {
            res.status(422).json(formatError(error));
        } else {
            res.sendStatus(500);
            console.error(error);
        }
    }
});


router.get("/", async (req, res) => {
    try {
        const result = await connection.query(
            "SELECT * FROM requests WHERE (status = 0 OR status = 1) AND userid = :id",
            {
                type: QueryTypes.SELECT,
                replacements: {
                    id: req.user.dataValues.id
                }
            }
        );
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

module.exports = router;