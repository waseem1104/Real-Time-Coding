const {Router} = require("express");
const {Message, User} = require("../models/postgres");
const connection = require("../models/postgres/db");
const {ValidationError, Op, QueryTypes} = require("sequelize");

const router = new Router();

router.get("/privateMessages/:id", async (req, res) => {
    try {
        const result = await Message.findAll({
            where: {
                advisor: parseInt(req.params.id, 10),
                userid: req.user.dataValues.id
            }
        });
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});


router.post("/privateMessages/new", async (req, res) => {
    const content = req.body.content.trim();
    try {
        const result = await Message.create({
            content: content,
            userid: req.user.dataValues.id,
            advisor: parseInt(req.body.advisor),
            isUser: true
        });
        res.status(201).json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});


module.exports = router;