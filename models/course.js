'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Course extends Model {};
  Course.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
    timestamps: false,
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, { foreignKey: 'userId' });
  };

  return Course;
};