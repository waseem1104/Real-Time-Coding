const { Router } = require("express");
const { Room, RoomMessage } = require("../models/postgres");
const connection = require("../models/postgres/db");
const { ValidationError, Op, QueryTypes } = require("sequelize");

const router = new Router();

const formatError = (validationError) => {
  return validationError.errors.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
  }, {});
};

router.get("/", async (req, res) => {
    try {
      const result = await Room.findAll();
      res.json(result);
    } catch (error) {
      res.sendStatus(500);
      console.error(error);
    }
});


router.get("/:id/messages", async (req, res) => {
  try {
    const result = await connection.query(
      "SELECT users.email, room_message.content FROM room_message, users WHERE room_message.roomid = :id AND users.id = room_message.userid", 
    { 
      type: QueryTypes.SELECT, 
      replacements: { 
        id: parseInt(req.params.id, 10)
      } 
    }
    );
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.post("/message/new", async (req, res) => {
  const content = req.body.content.trim();
  const roomid = req.body.roomid;

  try {
      const result = await RoomMessage.create({
          content: content,
          userid: 1,
          roomid: roomid
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
  
module.exports = router;