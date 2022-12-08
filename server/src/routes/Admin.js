const { Router } = require("express");
const {Room} = require("../models/postgres");
const {ValidationError, QueryTypes} = require("sequelize");


const router = new Router();

router.post("/room/new", async (req, res) => {
    const name = req.body.name.trim();
    const size = req.body.size;

    try {
        const result = await Room.create({
            name: name,
            size: size,
            status:1
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

router.get("/room/all", async (req, res) => {
    try {
        const result = await Room.findAll();
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});


module.exports = router;