/** Analytics Model
 * id PK (FK from problems) -> integet [Not Null]
 * userName -> string [Not Null]
 * solver -> enum [Not Null]
 * status -> enum //default: submitted, pending, solved, 
 */
//'use strict';

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes){
  return sequelize.define('Analytics', {
    problemId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    solver: {
      type: DataTypes.ENUM,
      values: ['Routing - VRP', 'Routing - CVRP', 'Routing - VRPTW', 'Max Flow', 'Min Cost Flow', 'Employee Scheduling', 'Scheduling - Job Shop'],
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['submitted', 'pending', 'solved'],
      allowNull: false,
      defaultValue: 'submitted'
    }
  }, {
    sequelize,
    tableName: 'Analytics',
    timestamps: false
  });
};