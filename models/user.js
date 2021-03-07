'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {};
  User.init({
    firstName: DataTypes.STRING,
    lastName: DataTypes.STRING,
    emailAddress: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
    timestamps: false,
  });

  User.associate = (models) => {
    User.hasMany(models.Course, { foreignKey: 'userId' });
  };

  return User;
};