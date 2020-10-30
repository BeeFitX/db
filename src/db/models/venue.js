'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Venue extends Model {
    static associate(models) {
      Venue.hasOne(models.VenueLocation, {
        as: "location",
        foreignKey: "venueId"
      });
    }
  };

  Venue.init({
    id: {
      type: DataTypes.UUID,
      allowNull: false,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
      field: "id"
    },
    managerId: {
      type: DataTypes.UUID,
      allowNull: false,
      field: "manager_id"
    },
    profilePicture: {
      type: DataTypes.STRING,
      field: "profile_picture",
      validate: {
        isUrl: true
      }
    },
    coverPicture: {
      type: DataTypes.STRING,
      field: "cover_picture",
      validate: {
        isUrl: true
      }
    },
    name: {
      type: DataTypes.STRING,
      field: "name",
      unique: true
    },
    slug: {
      type: DataTypes.STRING,
      field: "slug"
    },
    phone: {
      type: DataTypes.STRING,
      field: "phone"
    },
    capacity: {
      type: DataTypes.INTEGER,
      field: "capacity"
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
    modelName: 'Venue',
  });

  Venue.beforeCreate(instance => {
  });

  Venue.beforeUpdate(instance => {
  });

  return Venue;
};