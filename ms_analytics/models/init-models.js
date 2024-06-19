var DataTypes = require("sequelize").DataTypes;
var _Analytics = require("./Analytics");

function initModels(sequelize) {
  var Analytics = _Analytics(sequelize, DataTypes);

  return { Analytics };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;