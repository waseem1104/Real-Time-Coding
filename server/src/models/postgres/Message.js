const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class Message extends Model {}

Message.init(
    {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        isUser: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        }
    },
    {
        sequelize,
        modelName: "message",
    }
);

module.exports = Message;