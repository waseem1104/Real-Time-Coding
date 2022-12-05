const { Router } = require("express");
const { Room } = require("../models/postgres");

const router = new Router();

router.get("/", async (req, res) => {
    try {
      const result = await Room.findAll();
      res.json(result);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
});
  
module.exports = router;