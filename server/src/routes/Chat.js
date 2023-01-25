const { Router } = require("express");
const { Chat } = require("../models/postgres");

const router = new Router();

router.get("/", async (req, res) => {
    try {
      const result = await Chat.findAll();
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
