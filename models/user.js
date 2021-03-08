'use strict';
const { Model } = require('sequelize');


module.exports = (sequelize, DataTypes) => {
  class User extends Model {};
  User.init({
    // id: {
    //   type: DataTypes.INTEGER,
    //   primaryKey: true,
    //   autoIncrement: true
    // },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: {
        msg: '"firstName" cannot be empty'
      },
      validate: {
        notNull: {
          msg: 'Insert a value for "name"'
        }
      }
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      notEmpty: {
        msg: '"lastName" cannot be empty'
      },
      validate: {
        notNull: 'Insert a value for "lastName"'
      }
    },
    emailAddress: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: 'This email already exists'
      },
      validate: {
        notNull: {
          msg: 'Inser a value for "email"'
        }
      },
      isEmail: {
        msg: 'Provide a valid email address'
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Insert a valid password'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'User'
  });

  User.associate = (models) => {
    User.hasMany(models.Course, {
      foreignKey: {
        fieldName: 'userId',
        // allowNull: true
      },
      as: 'Student',
    });
  };

  return User;
};