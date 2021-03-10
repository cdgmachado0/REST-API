'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class Course extends Model {};
  Course.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: '"Title" is required'
        },
        notEmpty: {
          msg: '"Title" cannot be empty'
        }
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'A "description" is required'
        },
        notEmpty: {
          msg: '"Description" cannot be empty'
        }
      },
    },
    estimatedTime: DataTypes.STRING,
    materialsNeeded: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Course',
  });

  Course.associate = (models) => {
    Course.belongsTo(models.User, {
      foreignKey: 'userId',
      as: 'Student' 
    });
  };

  return Course;
};

