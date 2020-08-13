'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Company extends Model {
    static associate(models) {
      Company.hasMany(models.User, {
        as: 'users',
        foreignKey: 'id'
      })
    }
  };
  Company.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Company',
  });
  return Company;
};