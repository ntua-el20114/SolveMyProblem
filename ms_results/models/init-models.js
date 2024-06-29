var DataTypes = require("sequelize").DataTypes;
var _Results = require("./Results");

function initModels(sequelize) {
  var Results = _Results(sequelize, DataTypes);

  return { Results };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;