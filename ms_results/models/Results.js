/** Results Model
 * id PK (FK from problems) -> integer [Not Null]
 * userName -> string [Not Null]
 * solver -> enum [Not Null]
 * status -> enum //default: submitted, pending, solved, 
 */
//'use strict';

const Sequelize = require('sequelize');
module.exports = function(sequelize, DataTypes){
  return sequelize.define('Results', {
    problemId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      },
    problemName: {
      type: DataTypes.STRING,
      allowNull: false
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
    problemInput: {
      type: DataTypes.JSON,
      allowNull: false
    },
    problemOutput: {
      type: DataTypes.JSON,
      allowNull: false
    },
    timeSubmitted: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    solveTime: { // in milliseconds
      type: DataTypes.INTEGER,
      allowNull: false
  }
  }, {
    sequelize,
    tableName: 'Results',
    timestamps: false
  });
};