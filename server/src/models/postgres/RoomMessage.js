const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class RoomMessage extends Model {}

RoomMessage.init(
    {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "room_message",
        freezeTableName: true,
    }
);

module.exports = RoomMessage;