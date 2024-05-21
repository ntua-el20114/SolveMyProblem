const Sequelize = require('sequelize')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const sequelize = new Sequelize("", process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: process.env.DB_DIALECT,
    logging: false, // Set to true if you want to see the SQL queries
  });
  
  const db = {};
  
  db.Sequelize = Sequelize;
  db.sequelize = sequelize;

// Function to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
    try {
        await sequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        console.log('Database created or already exists.');
    } catch (error) {
        console.error('Error creating database:', error);
    }
};

// Synchronize models with database
const syncModels = async () => {
    try {
        const sequelize2 = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            logging: false, // Set to true if you want to see the SQL queries
        });

        // Importing the Problem model
        db.Problem = require('../models/Problems')(sequelize2, Sequelize.DataTypes);

        await sequelize2.sync();
        console.log('Models synchronized with database.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
};


module.exports = {
    ...db,
    createDatabaseIfNotExists,
    syncModels
};