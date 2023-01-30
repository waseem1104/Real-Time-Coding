const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class Request extends Model {}

Request.init(
    {
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },

        request_id:{
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        }
    },
    {
        sequelize,
        modelName: "request",
    }
);

module.exports = Request;