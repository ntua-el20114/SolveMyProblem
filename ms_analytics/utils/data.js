const { getSequelizeInstance } = require('../services/database');
var initModels = require("../models/init-models");
let sequelize;
let models;
  
async function calculateStatistics() {
    sequelize = await getSequelizeInstance();
    models = initModels(sequelize);
    const problems = await models.Analytics.findAll();
    const stats = {
      submitted: problems.filter(p => p.status === 'submitted').length,
      pending: problems.filter(p => p.status === 'pending').length,
      solved: problems.filter(p => p.status === 'solved').length,
    };
    return stats;
}

module.exports = {
    calculateStatistics,
}