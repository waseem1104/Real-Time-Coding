const { Router } = require("express");
const { Room, RoomMessage, RoomUser } = require("../models/postgres");
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
      const result = await connection.query(
        "SELECT id, name, size FROM rooms WHERE status = 1", 
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

router.get("/count", async (req, res) => {
  try {
    const result = await connection.query(
      "SELECT COUNT(room_user.roomid) as user_nb, roomid FROM room_user GROUP BY roomid", 
    { 
      type: QueryTypes.SELECT, 
    }
    );
    res.json(result);
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});

router.get("/:id/count", async (req, res) => {
  try {
    const result = await connection.query(
      "SELECT COUNT(room_user.roomid) as user_nb FROM room_user WHERE roomid = :id", 
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
          userid: req.user.dataValues.id,
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

router.post("/join", async (req, res) => {

  const roomid = req.body.roomid;

  try {
      const result = await RoomUser.create({
          userid: req.user.dataValues.id,
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

router.delete("/leave/:id", async (req, res) => {
  try {
    const nbLines = await RoomUser.destroy({
      where: {
        roomid: parseInt(req.params.id, 10),
        userid: req.user.dataValues.id
      },
    });
    if (!nbLines) {
      res.sendStatus(404);
    } else {
      res.sendStatus(204);
    }
  } catch (error) {
    res.sendStatus(500);
    console.error(error);
  }
});
  
module.exports = router;