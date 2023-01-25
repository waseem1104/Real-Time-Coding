const { Router } = require("express");
const { Chat, User } = require("../models/postgres");
const connection = require("../models/postgres/db");
const { ValidationError, Op, QueryTypes } = require("sequelize");

const router = new Router();

router.get("/", async (req, res) => {
    try {
      const result = await Chat.findAll({
        include: [
          {
            model: User,
            attributes: ["email"],
          },
        ],
      });
      res.json(result);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
});

router.post("/new", async (req, res) => {
    const content = req.body.content.trim();

    try {
        const result = await Chat.create({
            content: content,
            from: req.user.dataValues.id
        });
        res.status(201).json(result);
    } catch (error) {

        res.sendStatus(500);
        console.error(error);
        
    }
});

module.exports = router;
