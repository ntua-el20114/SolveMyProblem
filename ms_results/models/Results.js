/** Results Model
 * id PK (FK from problems) -> integet [Not Null]
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
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    solver: {
      type: DataTypes.ENUM,
      values: ['Routing - VRP', 'Routing - CVRP', 'Routing - VRPTW', 'Max Flow', 'Min Cost Flow', 'Employee Scheduling', 'Scheduling - Job Shop'],
      allowNull: false
    },
    problemData: {
      type: DataTypes.JSON,
      allowNull: false
    },
    timeSubmitted: {
      type: DataTypes.DATE(6),
      allowNull: false
    },
    //solver keeps the timestamp of the moment that the problem started solving "pending"
    SecondsOfSolve: {
      type: DataTypes.INTEGER,
      allowNull: false
  }
  }, {
    sequelize,
    tableName: 'Results',
    timestamps: false
  });
};