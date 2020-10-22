'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class EventImage extends Model {
    static associate(models) {
      EventImage.belongsTo(models.Event, {
        as: "images",
        foreignKey: "eventId"
      });
    }
  };

  EventImage.init({
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
    url: {
      type: DataTypes.STRING,
      field: "url",
      validate: {
        isUrl: true
      }
    },
    type: {
      type: DataTypes.STRING,
      field: "type",
      defaultValue: "image"
    },
    isCover: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      field: "is_cover"
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
    modelName: 'EventImage',
  });
  
  return EventImage;
};