const { Router } = require("express");
const {Room} = require("../models/postgres");
const {ValidationError, QueryTypes} = require("sequelize");
const connection = require("../models/postgres/db");

const router = new Router();

const formatError = (validationError) => {
    return validationError.errors.reduce((acc, error) => {
        acc[error.path] = error.message;
        return acc;
    }, {});
};

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
        const result = await Room.findAll({
          where:{
              status: 1
          }
        }
        );
        res.json(result);
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

router.get("/room/:id", async (req, res) => {
    try {
      const result = await Room.findByPk(parseInt(req.params.id, 10));
      if (!result) {
        res.status(404);
        res.send({
          success: false,
        });
      } else {
        res.json(result);
      }
    } catch (error) {
      console.error(error);
      res.sendStatus(500);
    }
  });


  router.get("/room/:id/count", async (req, res) => {
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

router.put("/room/edit/:id", async (req, res) => {
    
    try {   
        const [nbLines, [result]] = await Room.update(req.body, {
            where: {
                id: parseInt(req.params.id, 10),
            },
            returning: true,
        });
        if (!nbLines) {
            res.sendStatus(404);
        } else {
            res.json(result);
        }
    } catch (error) {
        console.log(error);
        if (error instanceof ValidationError) {
            res.status(422).json(formatError(error));
        } else {
            res.sendStatus(500);
            console.error(error);
        }
    }
});

router.patch("/room/delete/:id", async (req, res) => {
    
  try {   
      const [nbLines, [result]] = await Room.update({status:-1}, {
          where: {
              id: parseInt(req.params.id, 10),
          },
          returning: true,
      });
      if (!nbLines) {
          res.sendStatus(404);
      } else {
          res.json(result);
      }
  } catch (error) {
      console.log(error);
      if (error instanceof ValidationError) {
          res.status(422).json(formatError(error));
      } else {
          res.sendStatus(500);
          console.error(error);
      }
  }
});

module.exports = router;