const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class Room extends Model {}

Room.init(
    {
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        size: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        },
        
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
    },
    {
        sequelize,
        modelName: "room",
    }
);

module.exports = Room;