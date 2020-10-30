'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class VenueLocation extends Model {
    static associate(models) {
      VenueLocation.belongsTo(models.Venue, {
        as: "location",
        foreignKey: "venueId"
      });
    }
  };

  VenueLocation.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "id"
    },
    venueId: {
      allowNull: false,
      type: DataTypes.UUID,
      field: "venue_id"
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
      type: DataTypes.INTEGER,
      field: "zipcode"
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
    modelName: 'VenueLocation',
  });

  return VenueLocation;
};