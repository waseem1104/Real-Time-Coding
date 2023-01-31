const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class RoomUser extends Model {}

RoomUser.init(
    {
    },
    {
        sequelize,
        modelName: "room_user",
        freezeTableName: true,
    }
);

module.exports = RoomUser;