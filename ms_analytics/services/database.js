const Sequelize = require('sequelize')
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const initialSequelize = new Sequelize("", process.env.DB_USER, process.env.DB_PASSWORD, {
    host: process.env.DB_HOST,
    dialect: 'mysql', //process.env.DB_DIALECT,
    logging: false, // Set to true if you want to see the SQL queries
  });

  
  const db = {};
  db.sequelize=initialSequelize;
  
  db.Sequelize = Sequelize;
  db.initialSequelize = initialSequelize;

// Function to create the database if it doesn't exist
const createDatabaseIfNotExists = async () => {
    try {
        await initialSequelize.query(`CREATE DATABASE IF NOT EXISTS ${process.env.DB_NAME};`);
        //sequelize.config.database = process.env.DB_NAME;
        //sequelize.options.database = process.env.DB_NAME;
        //await sequelize.authenticate();
        console.log('Database created or already exists.');

        //Reinitialize sequelize with the correct name
        db.sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
            host: process.env.DB_HOST,
            dialect: process.env.DB_DIALECT,
            logging: false, // Set to true if you want to see the SQL queries
        });
        db.sequelize.authenticate();
        //console.log("create function:",db.sequelize);

    } catch (error) {
        console.error('Error creating database:', error);
    }
};

// Synchronize models with database
const syncModels = async () => {
    if (!db.sequelize) {
        console.error('Sequelize instance is not initialized.');
        return;
    }

    try {
        // Importing the Problem model
        db.Analytics = require('../models/Analytics')(db.sequelize, Sequelize.DataTypes);

        await db.sequelize.authenticate();
        await db.sequelize.sync();
        //console.log("sync models function:", db.sequelize);

        console.log('Models synchronized with database.');
    } catch (error) {
        console.error('Error synchronizing models:', error);
    }
};

const getSequelizeInstance = () => {
    if (!db.sequelize) {
        console.error('Sequelize instance is not initialized.');
        return null; // Or handle this case as needed
    }
    return db.sequelize;
};


module.exports = {
    ...db,
    createDatabaseIfNotExists,
    syncModels,
    getSequelizeInstance
};