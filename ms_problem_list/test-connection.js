const db = require('./services/database');

(async () => {
  try {
    await db.sequelize.authenticate();
    console.log('Database connection established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  } finally {
    await db.sequelize.close();
  }
})();
