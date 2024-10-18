const { Sequelize } = require('sequelize');

// Use either DATABASE_URL or individual connection parameters
const sequelize = process.env.DATABASE_URL
  ? new Sequelize(process.env.DATABASE_URL)
  : new Sequelize({
      database: process.env.DATABASE_NAME,
      username: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      dialect: 'mysql'
    });

module.exports = sequelize;
