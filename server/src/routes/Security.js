
const { Router } = require("express");
const bcryptjs = require("bcryptjs");
const router = new Router();
const { createToken } = require("../lib/jwt");
const { ValidationError } = require("sequelize");
const { User } = require("../models/postgres/");

const formatError = (validationError) => {
    return validationError.errors.reduce((acc, error) => {
      acc[error.path] = error.message;
      return acc;
    }, {});
  };

router.post("/login", async (req, res) => {
    try {
        
        const result = await User.findOne({
            where: {
                email: req.body.email,
                status: 1,
            },
        });
        if (!result) {
            res.status(401);
            res.send({
                success: false,
                message: 'Email not found'
            });
            return;
        }
        if (!(await bcryptjs.compare(req.body.password, result.password))) {
            res.status(401);
            res.send({
                success: false,
                message: 'Password is incorrect'
            });
            return;
        }

        res.status(200);
        res.json({
            token: await createToken(result),
            email: result.email,
            isAdmin: result.isAdmin,
            id: result.id
        });
    } catch (error) {
        res.sendStatus(500);
        console.error(error);
    }
});

router.post("/register", async (req, res) => {
  const email = req.body.email.trim();

  try {

    const result = await User.create({
      email: email,
      password: req.body.password,
      isAdmin: false,
      status: 1,
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
