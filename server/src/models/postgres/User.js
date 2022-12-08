const {DataTypes, Model} = require("sequelize");
const sequelize = require("./db");
const bcryptjs = require("bcryptjs");

class User extends Model {}

User.init(
    {
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                len: {
                    min: 6,
                    max: 255,
                },
            },
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            defaultValue: false,
            allowNull: false,
        },
        status: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
            allowNull: false,
        },
        token: {
            type: DataTypes.STRING,
            allowNull: true,
        },
    },
    {
        sequelize,
        modelName: "user",
    }
);

User.addHook("beforeCreate", async (user) => {
    user.password = await bcryptjs.hash(user.password, await bcryptjs.genSalt());
});
User.addHook("beforeUpdate", async (user, {fields}) => {
    if (fields.includes("password")) {
        user.password = await bcryptjs.hash(
            user.password,
            await bcryptjs.genSalt()
        );
    }
});

module.exports = User;