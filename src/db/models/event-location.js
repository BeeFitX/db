'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventLocation extends Model {
    static associate(models) {
      EventLocation.belongsTo(models.Event, {
        as: "location",
        foreignKey: "eventId"
      });
    }
  };

  EventLocation.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "id"
    },
    eventId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: "event_id"
    },
    country: {
      type: DataTypes.STRING,
      field: "country"
    },
    address: {
      type: DataTypes.STRING,
      field: "address"
    },
    buildingName: {
      type: DataTypes.STRING,
      field: "building_name"
    },
    city: {
      type: DataTypes.STRING,
      field: "city"
    },
    state: {
      type: DataTypes.STRING,
      field: "state"
    },
    zipcode: {
      type: DataTypes.STRING,
      field: "zipcode"
    },
    distance: {
      type: DataTypes.DECIMAL(12, 3),
      field: "distance"
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
    modelName: 'EventLocation',
  });
  
  return EventLocation;
};