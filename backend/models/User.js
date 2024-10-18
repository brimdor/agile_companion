const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const User = sequelize.define('User', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  displayName: {
    type: DataTypes.STRING,
    allowNull: true
  },
  role: {
    type: DataTypes.STRING,
    defaultValue: 'Member'
  },
  notifyOnTaskAssignment: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  notifyOnStatusChange: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
});

module.exports = User;
