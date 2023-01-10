exports.sequelize = require("./db");
exports.User = require("./User");
exports.Room = require("./Room");
exports.RoomMessage = require("./RoomMessage");
exports.RoomUser = require("./RoomUser");
exports.Planning = require("./Planning");


// ROOM MESSAGE //

exports.RoomMessage.belongsTo(exports.User, {through: exports.RoomMessage, foreignKey: "userid" });
exports.RoomMessage.belongsTo(exports.Room, {through: exports.RoomMessage, foreignKey: "roomid" });


// ROOM USER
exports.RoomUser.belongsTo(exports.User, {through: exports.RoomUser, foreignKey: "userid" });
exports.RoomUser.belongsTo(exports.Room, {through: exports.RoomUser, foreignKey: "roomid" });


exports.User.hasMany(exports.Planning);
exports.Planning.belongsTo(exports.User);

