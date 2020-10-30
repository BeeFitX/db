'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupLocation extends Model {
    static associate(models) {
      GroupLocation.belongsTo(models.Group, {
        as: "location",
        foreignKey: "groupId"
      });
    }
  };

  GroupLocation.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "id"
    },
    groupId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: "group_id"
    },
    country: {
      type: DataTypes.STRING,
      field: "country"
    },
    city: {
      type: DataTypes.STRING,
      field: "city"
    },
    state: {
      type: DataTypes.STRING,
      field: "state"
    },
    lat: {
      type: DataTypes.DECIMAL(12, 8),
      field: "lat"
    },
    lng: {
      type: DataTypes.DECIMAL(12, 8),
      field: "lng"
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      defaultValue: true,
      field: "is_active"
    },
    createdAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: "created_at",
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      allowNull: false,
      type: DataTypes.DATE,
      field: "updated_at",
      defaultValue: DataTypes.NOW
    }
  }, {
    sequelize,
    modelName: 'GroupLocation',
  });

  return GroupLocation;
};