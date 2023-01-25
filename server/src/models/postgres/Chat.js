const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class Chat extends Model {}

Chat.init(
    {
        content: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        from: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "chat",
    }
);

module.exports = Chat;