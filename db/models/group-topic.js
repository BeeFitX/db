'use strict';

const { Model } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class GroupTopic extends Model {
    static associate(models) {
    }
  };

  GroupTopic.init({
    groupId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      field: "group_id"
    },
    topicId: {
      primaryKey: true,
      allowNull: false,
      type: DataTypes.UUID,
      field: "topic_id"
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
    modelName: 'GroupTopic',
  });

  return GroupTopic;
};