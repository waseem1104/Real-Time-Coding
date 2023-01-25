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

module.exports = router;
