exports.sequelize = require("./db");
exports.User = require("./User");
exports.Room = require("./Room");
exports.RoomMessage = require("./RoomMessage");


// ROOM MESSAGE //

exports.RoomMessage.belongsTo(exports.User, {through: exports.RoomMessage, foreignKey: "userid" });
exports.RoomMessage.belongsTo(exports.Room, {through: exports.RoomMessage, foreignKey: "roomid" });
