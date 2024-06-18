/** Problems Model
 * id PK -> integet [Not Null]
 * name -> text [Not Null]
 * userName -> 
 * problemData -> string or json [Not Null]
 * timeSubmitted -> datetime [Not Null]
 * timeSolved --> datetime
 * solver -> enum [Not Null]
 * status -> enum //default: submitted, pending, solved, 
 */
//'use strict';

module.exports = (sequelize, DataTypes) => {
  const Problem = sequelize.define('Problem', {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    userName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    problemData: {
      type: DataTypes.JSON,
      allowNull: false
    },
    timeSubmitted: {
      type: DataTypes.DATE,
      allowNull: false
    },
    timeSolved: { 
      type: DataTypes.DATE,
      allowNull: true
    },
    solver: {
      type: DataTypes.ENUM,
      values: ['Routing - VRP', 'Routing - CVRP', 'Routing - VRPTW', 'Max Flow', 'Min Cost Flow'],
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM,
      values: ['submitted', 'pending', 'solved'],
      allowNull: false,
      defaultValue: 'submitted'
    }
  }, {
    tableName: 'Problems',
    timestamps: false
  });
  
  return Problem;
};